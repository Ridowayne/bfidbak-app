const io = require('socket.io');

const Review = require('../models/reviewModels');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/appError');
const app = require('../app');

// contoller for am post and get specific
// controller for receiver get related to him
// contoller for admin get all

exports.writeReview = catchAsync(async (req, res) => {
  const review = await Review.create({
    name: { toString: () => req.user.name },
    ratings: req.body.ratings,
    comments: req.body.comments,
  });

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

exports.getAmReviews = catchAsync(async (req, res, next) => {
  const allReviews = await Review.find({
    sender: { toString: () => req.user.name },
  });

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

exports.statsOfReview = catchAsync(async (req, res) => {
  const reviewStatistics = await Review.aggregate([
    {
      $group: {
        _id: '$ratings',
        count: { $sum: 1 },
      },
    },
  ]);
  reviewStatistics.length; // 4
  reviewStatistics.sort((d1, d2) => d1._id - d2._id);
  res.status(200).json({
    status: 'success',
    data: {
      reviewStatistics,
    },
  });
});

exports.allReviews = catchAsync(async (req, res, next) => {
  const all = await Review.find();

  if (!all) {
    return next(new ErrorResponse('there are no reviews found yet', 401));
  }

  res.status(200).json({
    status: 'success',
    results: all.length,
    data: {
      all,
    },
  });
});
