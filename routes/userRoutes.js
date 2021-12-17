const router = require('express').Router();
const userController = require('../controllers/userController');
const userMiddleware = require('../middleware/user');

router.route('/')
    .get(userController.getUsers)
    .post(userMiddleware, userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .put(userMiddleware, userController.updateUser)
    .delete(userController.deleteUser)

router.route('/:id/products')
    .get(userController.getAllProducts)

router.route('/login')
    .post(userController.login)

module.exports = router;