const req = require('express/lib/request');
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
    default: req.params.user.name,
  },
  to: {
    type: String,
    enum: ['Engineering', 'HR', 'Operations & TL', 'IT', 'Management'],
    required: [true, 'Kindly fill who to direct your feedback to'],
  },
  subject: {
    type: String,
    required: [
      true,
      'Kindly fill in the subject of what you wish to give feedback for',
    ],
  },
  body: {
    type: String,
    required: [true, 'Please provide information on your feedback'],
  },
  datesubmited: {
    type: Date,
    default: Date.now,
  },
  respondedBy: {
    type: String,
  },
  dateResolved: {
    type: Date,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolution: {
    type: String,
  },
  ratings: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  timeToResolve: {
    type: Number,
  },
});

formSchema.pre('save', function (next) {
  if (!this.isModified('resolution')) return next;

  this.dateResolved = Date.now;
});

formSchema.pre('save', function (next) {
  if (!this.isModified('resolutiion')) return next;

  this.resolved = true;
  next();
});

formSchema.pre('save', function (next) {
  if (!this.isModified('resolutiion')) return next;

  this.timeToResolve = datesubmited - dateResolved;
  next();
});
const Form = mongoose.model('Form', formSchema);
module.exports = Form;
