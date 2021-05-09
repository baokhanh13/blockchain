const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { handleError } = require('./middlewares/ErrorHandler');
const router = require('./routes');

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


app.listen(port, () => console.log(`Server is listening on port ${port}`));
