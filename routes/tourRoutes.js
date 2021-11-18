const express = require('express');

const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tours-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour)
  .get(tourController.getTour);

module.exports = router;
