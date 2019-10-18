const express = require('express');
const controller = require('./auth.controller');

const router = express.Router();

router.post('/signup', controller.signUp);

module.exports = router;
