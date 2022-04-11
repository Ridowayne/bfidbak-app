const Form = require('../models/formModels');
const Review = require('../models/reviewModels');
const ErrorResponse = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllFeedbacks = catchAsync(async (req, res, next) => {
  const feedbacks = await Form.find()
    .select(['-__v'])
    .populate('ratings')
    .sort({ datesubmited: -1 })
    .limit(15);

  res.status(200).json({
    status: 'success',
    results: feedbacks.length,
    data: {
      feedbacks,
    },
  });
});

// get one feedback
exports.getFeedback = catchAsync(async (req, res, next) => {
  const feedback = await Form.findById(req.params.id);

  if (!feedback) {
    return next(new ErrorResponse('No tour found with such id', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      feedback,
    },
  });
});

exports.answeredTickets = catchAsync(async (req, res, next) => {
  const done = await Form.find({ resolved: true })
    .select(['-__v'])
    .populate('ratings')
    .sort({ datesubmited: -1 });

  if (!done) {
    return next(new ErrorResponse('There are no resolved tickets', 404));
  }

  res.status(200).json({
    status: 'success',
    results: done.length,
    data: {
      done,
    },
  });
});

exports.unansweredTickets = catchAsync(async (req, res, next) => {
  const undone = await Form.find({ resolved: false })
    .select(['-__v'])
    .populate('ratings')
    .sort({ datesubmited: -1 });

  if (!undone) {
    return next(new ErrorResponse('There are no unresolved tickets', 404));
  }

  res.status(200).json({
    status: 'success',
    results: undone.length,
    data: {
      undone,
    },
  });
});

exports.getreveiews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// stats on ratings
exports.ratingsAndReviwsStats = catchAsync(async (req, res, next) => {
  const stats = Review.aggregate();
  // needs to work on the starts for the rstings

  res.stats(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
