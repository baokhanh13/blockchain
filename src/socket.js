const { Blockchain, Transaction } = require("./blockchain");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

let blockchain = new Blockchain();

module.exports = function (io, socket) {
    console.log('New user connected');
    socket.on('identity', ({ privateKey }) => {
        socket.privateKey = privateKey;
    });

    socket.on('disconnect', () => {
        console.log('disconnected...');
    })

    socket.on('mine', (address) => {
        blockchain.minePendingTransactions(address);
    });

    socket.on('transfer', ({ fromAddress, toAddress, amount }) => {
        const tx = new Transaction(fromAddress, toAddress, amount);
        tx.signTransaction(ec.keyFromPrivate(socket.privateKey));
        blockchain.addTransaction(tx);
    });

    socket.on('get-balance', (address) => {
        socket.emit('balance', blockchain.getBalanceOfAddress(address));
    });
}