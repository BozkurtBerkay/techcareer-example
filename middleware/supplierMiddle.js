const { body, validationResult } = require('express-validator');
const suppliersMiddle = [
    body('companyName').notEmpty().withMessage('Supplier companyName is required').isString().withMessage('Supplier companyName is not string'),
    body('contactName').notEmpty().withMessage('Supplier contactName is required').isString().withMessage('Supplier contactName is not string'),
    body('contactTitle').notEmpty().withMessage('Supplier contactTitle is required').isString().withMessage('Supplier contactTitle is not string'),
    body('street').notEmpty().withMessage('Supplier street is required').isString().withMessage('Supplier street is not string'),
    body('city').notEmpty().withMessage('Supplier city is required').isString().withMessage('Supplier city is not string'),
    body('region').notEmpty().withMessage('Supplier region is required').isString().withMessage('Supplier region is not string'),
    body('postalCode').notEmpty().withMessage('Supplier postalCode is required').isNumeric().withMessage('Supplier postalCode is not number'),
    body('country').notEmpty().withMessage('Supplier country is required').isString().withMessage('Supplier country is not string'),
    body('phone').notEmpty().withMessage('Supplier phone is required').isNumeric().withMessage('Supplier phone is not number'),
    function (req, res, next) {
        var err = validationResult(req);
        if (!err.isEmpty()) return res.status(400).json({ error: err.errors.map(i => i.message) });
        next();
    }
]

module.exports = suppliersMiddle