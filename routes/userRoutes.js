const router = require('express').Router();
const userController = require('../controllers/userController');
const userMiddleware = require('../middleware/user');
const Auth = require('../middleware/auth');
const passport = require('passport');

router.route('/')
    .get(userController.getUsers)
    .post(Auth, userMiddleware, userController.createUser)

router.route('/:id')
    .get(userController.getUser)
    .put(Auth, userMiddleware, userController.updateUser)
    .delete(Auth, userController.deleteUser)

router.route('/:id/products')
    .get(userController.getAllProducts)

router.route('/login')
    .post(userController.login)

router.route('/auth/google')
    .get(passport.authenticate('google', { scope: ['email', 'profile'] }))

router.route('/auth/google/callback')
    .get(passport.authenticate('google', {
        failureRedirect: '/'
    }), userController.authGoogle)

module.exports = router;