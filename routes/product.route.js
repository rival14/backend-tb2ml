let express = require('express'),
    router = express.Router();
const axios = require('axios');
const queryString = require('node:querystring');
const { getProduct, massUploadShopee } = require('../controllers/ProductController')

router.route('/').get(getProduct);
router.route('/mass-upload-shopee').get(massUploadShopee);

module.exports = router;