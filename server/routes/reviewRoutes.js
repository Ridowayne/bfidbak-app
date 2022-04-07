const express = require('express');
const app = express();
const router = express.Router;

const reviewContoller = require('../controllers/reveiwController');

// still needs to restrict reviewing to onling ams and other things should be for other people
app
  .route('/')
  .get(reviewContoller.getReviews)
  .post(reviewContoller.writeReview);
app.route('/stats', reviewContoller.statsOfReview);

app.route('/:id').get(reviewContoller.getReview);

module.exports = app;
