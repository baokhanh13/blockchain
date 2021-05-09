const { Blockchain } = require("./blockchain")

let blockchain = new Blockchain();

module.exports = function (io, socket) {
    console.log('New user connected');
    socket.on('disconnect', () => {
        console.log('disconnected...');
    })

    socket.
}