const walletRoute = require('./wallet/wallet.route');

const express = require('express');
const router = express.Router();


router.use('/wallets', walletRoute);

module.exports = router;