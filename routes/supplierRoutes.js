const router = require('express').Router();
const supplierController = require('../controllers/supplierController');
const supplierMiddle = require('../middleware/supplierMiddle');

router.route('/')
    .get(supplierController.getSuppliers)
    .post(supplierMiddle, supplierController.createSupplier)

router.route('/:id')
    .get(supplierController.getSupplier)
    .delete(supplierController.deleteSupplier)
    .put(supplierMiddle, supplierController.updateSupplier)

module.exports = router