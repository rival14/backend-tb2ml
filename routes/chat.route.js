let mongoose = require('mongoose'),
  express = require('express'),
  router = express.Router();
const axios = require('axios');
const queryString = require('node:querystring');

// Chat Model
let chatSchema = require('../models/Chat');

// CREATE Chat
router.route('/test').get(async (req, res, next) => {
  function createQueryParam(conversation) {
    const encodedConversation = JSON.stringify(conversation);
    return queryString.stringify({ q: encodedConversation });
  }

  let conversationHistory = [];
  conversationHistory.push({ role: 'user', content: 'Halo!' });
  const queryParam = createQueryParam(conversationHistory);
  const url = `https://openai.a2hosted.com/chat?${queryParam}`;
  const headers = {
    authority: 'openai.a2hosted.com',
    accept: 'text/event-stream',
    'accept-language': 'en-US,en;q=0.9,id;q=0.8,ja;q=0.7',
    'cache-control': 'no-cache',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36 Edg/113.0.0.0',
  };

  let assistantOutput = '';
  axios
    .get(url, { headers: headers, responseType: 'stream' })
    .then(response => {
      response.data.on('data', chunk => {
        const message = chunk.toString('utf-8');
        const msgMatch = /"msg":"(.*?)"/.exec(message);
        const numMatch = /\[DONE\] (\d+)/.exec(message);

        if (msgMatch) {
          assistantOutput += ' ' + msgMatch[1].trim().replace(/\n/g, ' ');
        }

        if (numMatch) {
          conversationHistory.push({
            role: 'assistant',
            content: assistantOutput.trim(),
          });
        }
      });

    })
    .catch(error => {
      console.error(error);
    });
    console.log(assistantOutput)
    res.json({ res: assistantOutput.trim() })

});

router.route('/').post(async (req, res, next) => {
  try {
    const response = await chatSchema.create(req.body)
    res.json(response)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Single Chat
router.route('/:appId').get(async (req, res, next) => {
  try {
    const response = await chatSchema.find({ appId: req.params.appId })
    res.json(response)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;