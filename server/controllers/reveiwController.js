const io = require('socket.io');

const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/appError');

exports.writeReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);

  // io.emit('review', review);

  res.status(201).json({
    status: 'Success',
    data: {
      review,
    },
  });
});

exports.getReview = catchAsync(async (req, res, next) => {
  const reviewDetail = await Review.findById(req.params.id);

  if (!reviewDetail) {
    return next(new ErrorResponse('there is no review with such id', 401));
  }

  res.status(200).json({
    status: 'success',
    data: {
      reviewDetail,
    },
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  const allReviews = await Review.find();

  if (!allReviews) {
    return next(new ErrorResponse('There are no reveiews yet', 401));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      allReviews,
    },
  });
});

exports.reviewStats = catchAsync(async (req, res) => {
  const stats = await Review.aggregate();

  res.status(200).json({
    status: 'success',
    results: stats.length,
    data: {
      stats,
    },
  });
});
