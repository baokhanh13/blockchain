const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { handleError } = require('./middlewares/ErrorHandler');
const router = require('./routes');
const http = require('http');
const socketIO = require('socket.io');

require('dotenv').config();

app.use(express.json());

mongoose
	.connect(process.env.DB_PASS, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
	})
	.then(() => console.log('Connect to db succesfully'))
	.catch((e) => console.log(e));

const port = process.env.PORT || 4000;

app.get('/', (req, res) => res.json({ msg: 'Hello' }));

app.use('/api', router);

app.use((err, req, res, next) => {
	handleError(err, res);
});

const server = http.createServer(app);
const io = socketIO(server, {
	cors: {
		origin: '*'
	}
});

io.on('connection', (socket) => require('./socket')(io, socket));


server.listen(port, () => console.log(`Server is listening on port ${port}`));
