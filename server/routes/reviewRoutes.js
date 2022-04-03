const express = require('express');
const app = express();
const router = express.Router;

const reviewContoller = require('../controllers/reveiwController');

// still needs to restrict reviewing to onling ams and other things should be for other people
app
  .route('/')
  .get(reviewContoller.getReviews)
  .get(reviewContoller.reviewStats)
  .post(reviewContoller.writeReview);

app.route('/:id').get(reviewContoller.getReview);

module.exports = app;
