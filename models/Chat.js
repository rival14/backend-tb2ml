const mongoose = require("mongoose");

const Schema = mongoose.Schema;
let chatSchema = new Schema({
  appId: String,
  text: String,
  me: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'chats'
});

module.exports = mongoose.model('Chat', chatSchema)