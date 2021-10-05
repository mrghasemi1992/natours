const Tour = require('../models/tourModel');

exports.getAllTours = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

exports.getTour = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({ status: 'success', data: { tour: newTour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.updateTour = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};

exports.deleteTour = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined!' });
};
