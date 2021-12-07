const router = require('express').Router();
const ordersController = require('../controllers/ordersController');

router.route('/orders')
    .get(ordersController.getOrders)

router.route('/orders/:id')
    .get(ordersController.getOrder)

module.exports = router;