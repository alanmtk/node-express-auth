const express = require('express');
const bcrypt = require('bcrypt');
const userSchema = require('./auth.schema');
const db = require('./../db');

const users = db.get('users');
const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const userValidation = userSchema.validate(req.body);
    if (!userValidation.error) {
        const { username, email, password } = req.body;
        const userExists = await users.findOne({ email });
        if (!userExists) {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await users.insert({ username, email, password: hashedPassword });
            delete user.password;
            res.send(user);
        } else {
            res.statusCode = 409;
            next(new Error('That email was taken by another user.'));
        }
    } else {
        res.statusCode = 422;
        next(new Error(userValidation.error.message));
    }
});

module.exports = router;
