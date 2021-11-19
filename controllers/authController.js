const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });

  res.status(201).json({
    status: 'success',
    token: signToken(newUser._id),
    data: { user: newUser },
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) If email and password are exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check user exists and the password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        'There is no user with that email or the password is incorrect',
        401
      )
    );
  }

  // 3) If everything is ok, send token to the client
  res.status(200).json({
    status: 'success',
    token: signToken(user._id),
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Token existence
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.passwordChangedAt) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});
