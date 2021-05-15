const { ErrorHandler } = require('../middlewares/ErrorHandler');
const Block = require('./block');
const Transaction = require('./transaction');

class Blockchain {
	constructor() {
		this.chain = [this.createGenesisBlock()];
		this.difficulty = 2;
		this.pendingTransactions = [];
		this.miningReward = 100;
	}

	createGenesisBlock() {
		return new Block(Date.parse('2021-10-05'), [], '0');
	}

	getLatestBlock() {
		return this.chain[this.chain.length - 1];
	}

	minePendingTransactions(miningRewardAddress) {
		const rewardTx = new Transaction(
			null,
			miningRewardAddress,
			this.miningReward
		);
		this.pendingTransactions.push(rewardTx);
		const block = new Block(
			Date.now(),
			this.pendingTransactions,
			this.getLatestBlock().hash
		);
		block.mineBlock(this.difficulty);

		this.chain.push(block);
		this.pendingTransactions = [];
	}

	addTransaction(transaction) {
		if (!transaction.fromAddress || !transaction.toAddress) {
			throw new Error('Transaction must include address');
		}
		if (!transaction.isValid()) {
			throw new Error('Transaction must be validated');
		}
		if (transaction.amount <= 0) {
			throw new Error('Amount must be higher than 0');
		}
		if (
			this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount
		) {
			throw new Error('Amount must be smaller than balance');
		}
		this.pendingTransactions.push(transaction);
	}

	getBalanceOfAddress(address) {
		let balance = 0;
		for (const block of this.chain) {
			for (const trans of block.transactions) {
				if (trans.fromAddress === address) {
					balance -= trans.amount;
				}

				if (trans.toAddress === address) {
					balance += trans.amount;
				}
			}
		}
		return balance;
	}

	getAllTransactionsForWallet(address) {
		const txs = [];
		this.chain
			.forEach((block) =>
				block.transactions.forEach((tx) => {
					if (tx.fromAddress === address || tx.toAddress === address) txs.push(tx);
				})
			);
		return txs;
	}
}

module.exports = Blockchain;
