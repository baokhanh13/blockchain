const crypto = require('crypto');

class Block {
	constructor(timestamp, transactions, previousHash = '') {
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.nonce = 0;
		this.hash = this.calculateHash();
	}

	calculateHash() {
		return crypto
			.createHash('sha256')
			.update(
				this.previousHash +
					this.timestamp +
					JSON.stringify(this.transactions) +
					this.nonce
			)
			.digest('hex');
	}

	mineBlock(difficulty = 4) {
		while (
			this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
		) {
			this.nonce++;
			this.hash = this.calculateHash();
		}
	}

	hasValidTransactions() {
		for (const tx of this.transactions) {
			if (!tx.isValid()) {
				return false;
			}
		}

		return true;
	}
}

module.exports = Block;
