const User = require('../models/userModels');
const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/appError');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const allUsers = await User.find();

  res.status(200).json({
    status: 'success',
    results: allUsers.length,
    data: {
      allUsers,
    },
  });
});
