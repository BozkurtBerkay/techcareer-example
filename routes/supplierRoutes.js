const router = require('express').Router();
const supplierController = require('../controllers/supplierController');
const supplierMiddleware = require('../middleware/supplier');

router.route('/')
    .get(supplierController.getSuppliers)
    .post(supplierMiddleware, supplierController.createSupplier)

router.route('/:id')
    .get(supplierController.getSupplier)
    .delete(supplierController.deleteSupplier)
    .put(supplierMiddleware, supplierController.updateSupplier)

module.exports = router