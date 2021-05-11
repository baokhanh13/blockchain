const { createWallet, login } = require('./wallet.controller');
const express = require('express');
const router = express.Router();

router.post('/register', createWallet);
router.post('/login', login);


module.exports = router;