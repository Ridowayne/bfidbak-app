const mongoose = require('mongoose');
const Form = require('./formModels');

const ratingSchema = new mongoose.Schema({
  ratings: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  Comments: {
    type: String,
  },
  // form: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: Form
  // },
});

const Ratings = mongoose.model('Ratings', ratingSchema);
module.exports = Ratings;
