const express = require('express');

const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/sign-up').post(authController.signUp);
router.route('/sign-in').post(authController.signIn);

router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password').post(authController.resetPassword);

router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser)
  .get(userController.getUser);

module.exports = router;
