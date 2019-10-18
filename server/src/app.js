require('dotenv').config();

const express = require('express');

const app = express();
const volleyball = require('volleyball');

const auth = require('./auth/auth.routes');

app.use(volleyball);
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello 🌎!' });
});

app.use('/auth', auth);

app.use((req, res, next) => {
    const error = new Error(`Not found: ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    res.status(res.statusCode || 500);
    const { message } = err;
    res.json({ message });
});

module.exports = app;
