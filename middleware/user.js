const { body, validationResult } = require('express-validator');
const userMiddleware = [
    body('name').notEmpty().withMessage('User name is required').isString().withMessage('User name is not string'),
    body('email').notEmpty().withMessage('User email is required').isEmail().withMessage('User email is not email format'),
    body('password').notEmpty().withMessage('User email is required'),
    function (req, res, next) {
        var err = validationResult(req);
        if (!err.isEmpty()) return res.status(400).json({ error: err.errors.map(i => i.msg) });
        next();
    }
]

module.exports = userMiddleware