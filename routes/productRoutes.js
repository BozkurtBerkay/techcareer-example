const productController = require('../controllers/productController');
const router = require('express').Router();
const productMiddle = require('../middleware/productMiddle');

router.route('/')
    .get(productController.getProducts)
    .post(productMiddle, productController.createProduct)

router.route('/:id')
    .get(productController.getProduct)
    .delete(productController.deleteProduct)
    .put(productMiddle, productController.updateProduct)

module.exports = router