const io = require('socket.io');

const Review = require('../models/reviewsModels');
const catchAsync = require('../utils/catchAsync');

exports.writeReview = catchAsync(async (req, res) => {
  const review = await Review.create(req.body);

  io.emit('review', review);

  res.status(201).json({
    status: 'Success',
    data: {
      review,
    },
  });
});
