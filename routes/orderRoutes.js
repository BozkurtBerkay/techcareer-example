const router = require('express').Router();
const ordersController = require('../controllers/ordersController');

router.route('/')
    .get(ordersController.getOrders)

router.route('/:id')
    .get(ordersController.getOrder)

module.exports = router;