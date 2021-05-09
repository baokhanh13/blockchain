const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ec } = require('elliptic');

const EC = new ec('secp256k1');

const walletSchema = new mongoose.Schema({
	privateKey: String,
	publicKey: String,
	password: {
		type: String,
		required: 'true',
	},
});

walletSchema.pre('save', async function (next) {
	const wallet = this;
	if (wallet.isModified('password')) {
		wallet.password = await bcrypt.hash(wallet.password, 10);
	}
	const keyPair = EC.genKeyPair();
	const privateKey = keyPair.getPrivate();
	const key = EC.keyFromPrivate(privateKey, 'hex');
	wallet.privateKey = privateKey.toString(16);
	wallet.publicKey = key.getPublic().encode('hex');
	next();
});


const wallet = new mongoose.model('Wallet', walletSchema);

module.exports = wallet;
