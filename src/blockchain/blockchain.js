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
			throw new ErrorHandler(400, 'Transaction must include address');
		}
		if (!transaction.isValid()) {
			throw new ErrorHandler(400, 'Transaction must be validated');
		}
		if (transaction.amount <= 0) {
			throw new ErrorHandler(400, 'Amount must be higher than 0');
		}
		if (
			this.getBalanceOfAddress(transaction.fromAddress) < transaction.amount
		) {
			throw new ErrorHandler(400, 'Amount must be smaller than balance');
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
		const txs = this.chain.map((block) =>
			block.transactions.map((tx) => {
				if (tx.fromAddress === address || tx.toAddress) return tx;
			})
        );
        return txs;
    }
    
    isChainValid() {
        const realGenesis = JSON.stringify(this.createGenesisBlock());

        if (realGenesis !== JSON.stringify(this.chain[0])) {
            return false;
        }

        const validChain = this.chain.filter(block => !block.hasValidTransactions() || block.hash !== block.calculateHash());
        console.log(validChain);
        return validChain.length === 0;
    }
}

module.exports = Blockchain;
