const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { signUpSchema, signInSchema } = require('./auth.schema');
const db = require('./../db');

const users = db.get('users');

const signUp = async (req, res, next) => {
    const userValidation = signUpSchema.validate(req.body);
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
};

const signIn = async (req, res, next) => {
    const userValidation = signInSchema.validate(req.body);
    if (!userValidation.error) {
        const { email, password } = req.body;
        const user = await users.findOne({ email });
        if (user) {
            const checkPassword = await bcrypt.compare(password, user.password);
            if (checkPassword) {
                const { _id: id, email } = user;
                const payload = { id, email };
                jwt.sign(
                    payload,
                    process.env.JWT_TOKEN_SECRET,
                    {
                        expiresIn: '1d'
                    },
                    (err, token) => {
                        if (err) {
                            res.statusCode = 500;
                            next(
                                new Error(
                                    'There was an error during the authentication process. Try again.'
                                )
                            );
                        }
                        res.json({ token });
                    }
                );
            } else {
                res.statusCode = 401;
                next(new Error('Invalid credentials.'));
            }
        } else {
            res.statusCode = 401;
            next(new Error('Invalid credentials.'));
        }
    } else {
        res.statusCode = 422;
        next(new Error(userValidation.error.message));
    }
};

module.exports = { signUp, signIn };
