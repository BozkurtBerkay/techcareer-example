const northwindController = require('../controllers/northwindController')
const router = require('express').Router();

router.route('/products')
    .get(northwindController.getAllProducts)

router.route('/add-products')
    .get(northwindController.getAddProduct)
    .post(northwindController.addProduct)

router.route('/products/delete/:id')
    .get(northwindController.deleteProduct)

router.route('/products/update-products/:id')
    .get(northwindController.getUpdateProduct)
    .post(northwindController.updateProduct)

module.exports = router