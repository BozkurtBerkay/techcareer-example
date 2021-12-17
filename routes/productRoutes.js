const productController = require('../controllers/productController');
const router = require('express').Router();
const productMiddleware = require('../middleware/product');

router.route('/')
    .get(productController.getProducts)
    .post(productMiddleware, productController.createProduct)

router.route('/:id')
    .get(productController.getProduct)
    .delete(productController.deleteProduct)
    .put(productMiddleware, productController.updateProduct)

module.exports = router