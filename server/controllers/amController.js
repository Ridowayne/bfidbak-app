const io = require('socket.io');
const sendEmail = require('../utils/');

const app = require('./../app');
const Form = require('../models/formModels');
const catchAsync = require('./../utils/catchAsync');
const ErrorResponse = require('../utils/appError');
// const APIFeatures = require('../utils/apiFeatures');

// for sending forms
exports.sendForm = catchAsync(async (req, res, next) => {
  console.log('hi');
  //   const form = await Form.create(req.body);

  console.log(req.body);

  //   io.on('form', (socket) => {
  //     socket.emit('newFeedback', form);
  //   });
  console.log('vvvvvvv');

  res.status(200).json({
    status: 'success',
    feedback: {
      //   form,
    },
  });
});

// for getting all feedback forms GET belonging to the user
exports.readForms = catchAsync(async (req, res) => {
  //   const user = req.user.name;
  const allForms = await Form.find();
  //   { sender: user }

  if (!allForms) {
    return next(
      new ErrorResponse('you do not have any feedback submitted yet')
    );
  }
  console.log('yolo');

  //   io.on('connection', (socket) => {
  //     // send a message to the client
  //     socket.emit('user', allForms);
  //   });

  res.status(200).json({
    status: 'success',
    feedback: {
      allForms,
    },
  });
});

// for responding to responding to forms by resolver GET
exports.respondToForm = catchAsync(async (req, res, next) => {
  const response = await Form.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!response) {
    return next(new ErrorResponse('no tour found with such id', 404));
  }
  io.Socket.on('response', function (response) {
    io.Socket.emit('agentResponse', response);
  });
  res.status(201).json({
    status: 'sucess',
    data: {
      response,
    },
  });
});

// for reading one parrticular form GET
exports.readForm = catchAsync(async (req, res, next) => {
  const oneForm = await Form.findById(req.params.id);

  if (!oneForm) {
    return next(new ErrorResponse('no form found with such id', 404));
  }

  res.status(200).json({
    status: 'success',
    feedback: {
      allForm,
    },
  });
});
