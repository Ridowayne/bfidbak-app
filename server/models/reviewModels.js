const mongoose = require('mongoose');
const Form = require('./formModels');

const ratingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    ratings: {
      type: Number,
      min: 1,
      max: 5,
    },
    comments: {
      type: String,
    },
    form: {
      type: mongoose.Schema.ObjectId,
      ref: 'Form',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ratingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'form',
    select: '-__v',
  });

  next();
});

const Ratings = mongoose.model('Ratings', ratingSchema);
module.exports = Ratings;
