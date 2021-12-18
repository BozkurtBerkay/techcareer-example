const productController = require('../controllers/productController');
const router = require('express').Router();
const productMiddleware = require('../middleware/product');
const Auth = require('../middleware/auth');

router.route('/')
    .get(productController.getProducts)
    .post(Auth, productMiddleware, productController.createProduct)

router.route('/:id')
    .get(productController.getProduct)
    .delete(Auth, productController.deleteProduct)
    .put(Auth, productMiddleware, productController.updateProduct)

module.exports = router