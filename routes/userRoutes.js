const router = require('express').Router();
const userController = require('../controllers/userController');
const userMiddle = require('../middleware/userMiddle');

router.route('/')
    .get(userController.getUsers)
    .post(userMiddle, userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .put(userController.updateUser)
    .delete(userController.deleteUser)

module.exports = router;