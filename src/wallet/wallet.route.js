const { createWallet } = require('./wallet.controller');
const express = require('express');
const router = express.Router();

router.post('/', createWallet);

module.exports = router;