const { Blockchain, Transaction } = require("./blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

let blockchain = new Blockchain();

module.exports = function (io, socket) {
    console.log('New user connected');

    socket.on('disconnect', () => {
        console.log('disconnected...');
    })

    socket.on('mine', (address) => {
        blockchain.minePendingTransactions(address);
        socket.emit('balance', blockchain.getBalanceOfAddress(address));
    });

    socket.on('transfer', ({ privateKey, fromAddress, toAddress, amount }) => {
        amount = parseInt(amount);
        try {
            const tx = new Transaction(fromAddress, toAddress, amount);
            tx.signTransaction(ec.keyFromPrivate(privateKey));
            blockchain.addTransaction(tx);
            socket.emit('transfer-success');
        } catch (e) {
            console.log(e.stack);
            if (e.message === 'Unknown point format') {
                e.message = 'Wrong address';
            }
            socket.emit('transfer-fail', e.message);
            console.log(e.message);
        }
    });

    socket.on('get-balance', (address) => {
        socket.emit('balance', blockchain.getBalanceOfAddress(address));
    });

    socket.on('get-transactions', (address) => {
        socket.emit('transactions', blockchain.getAllTransactionsForWallet(address));
    });
}