const router = require('express').Router();
const suppliersController = require('../controllers/suppliersController');
const suppliersMiddle = require('../middleware/suppliersMiddle');

router.route('/suppliers')
    .get(suppliersController.getSuppliers)
    .post(suppliersMiddle, suppliersController.createSupplier)

router.route('/suppliers/:id')
    .get(suppliersController.getSupplier)
    .delete(suppliersController.deleteSupplier)
    .put(suppliersMiddle, suppliersController.updateSupplier)

module.exports = router