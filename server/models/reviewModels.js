const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  ratings: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
  Comments: {
    type: String,
  },
});

const Ratings = mongoose.model('Ratings', ratingSchema);
module.exports = Ratings;
