const req = require('express/lib/request');
require('dotenv').config({ path: __dirname + '/config.env' });
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('../models/userModels');

const catchAsync = require('../utils/catchAsync');
const ErrorResponse = require('../utils/appError');

// make token
const signToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// sending token
// const createToken = (user, statusCode, req, res) => {
//   const token = signToken(user._id, user.name);
//   const cookiesOptions =
//     // ('jwt',
//     // token,
//     {
//       expires: new Date(
//         Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000
//       ),
//       httpOnly: true,
//       // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
//     };

//   if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

//   // res.cookie('jwt', token, cookiesOptions);

//   // remove password from out put
//   user.password = undefined;

//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     // message: `welcome ${req.user.name}`,
//     data: {
//       user,
//     },
//   });
// };

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // remove the password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

// sign user up
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    bfreeID: req.body.bfreeID,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    designation: req.body.designation,
  });

  createToken(newUser, 201, req, res);
});

// log user in
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check that user actually submit a password and email
  if (!email || !password) {
    return next(
      new ErrorResponse(
        'kindly submit an email and password for verificatioin',
        401
      )
    );
  }

  // search for user
  const user = await User.findOne({ email })
    .select('+password')
    .select('+name');

  // confirm them from the database if they are there
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new ErrorResponse('Incorrect email or password', 401));
  }

  createToken(user, 200, res);
  req.user = user;
  console.log(req.user);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// protect routes to only signed in user
exports.protect = catchAsync(async (req, res, next) => {
  // 1) getting the token and checking id user has token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new ErrorResponse(
        'You are not logged in, Kindly log in to be able to perfrom this action',
        401
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new ErrorResponse(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after token was changed issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ErrorResponse(
        'We detected a  recent password change🤔, Kindly log in again.',
        401
      )
    );
  }

  // GRANT ACCESS TO VERIFIED USER TO USE PROTECTED ROUTES
  req.user = currentUser;
  module.exports.senderInfo = req.user.name;

  // res.locals.user = currentUser;
  console.log(req.user.name);
  next();
});

// restricting access to routes based on desigation
exports.restrictTo = (...designation) => {
  return (req, res, next) => {
    // roles ['am', 'Admin', 'Operation', 'HR', 'Management']
    if (!designation.includes(req.user.designation)) {
      return next(
        new ErrorResponse(
          'You do not have permission to performthis action',
          403
        )
      );
    }
    next();
  };
};

// forgot password
exports.forgotpassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse('There is no user with email address', 404));
  }
  // generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new ErrorResponse(
        'There was an error sending your pasword reset Token to your mail, Try again after 5 mins',
        500
      )
    );
  }
});

// resetting the password after email has been recieved
exports.resetPassword = catchAsync(async (req, res, next) => {
  // get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) if token has not expired and there is user, reset the password
  if (!user) {
    return next(new ErrorResponse('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createToken(user, 200, res);
});
