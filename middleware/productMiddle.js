const { body, validationResult } = require('express-validator');
const productMiddle = [
    body('name').notEmpty().withMessage('Product name is required').isString().withMessage('Product name is not string'),
    body('unitPrice').notEmpty().withMessage('Unit price is required').isNumeric().withMessage('Unit price is not numeric'),
    body('quantityPerUnit').notEmpty().withMessage('Quantity per unit is required').isString().withMessage('Quentity per unit is not string'),
    function (req, res, next) {
        var err = validationResult(req);
        if (!err.isEmpty()) return res.status(400).json({ error: err.errors.map(i => i.msg) });
        next();
    }
]

module.exports = productMiddle