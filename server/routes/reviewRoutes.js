const express = require('express');
const app = express();
const router = express.Router;

const reviewContoller = require('../controllers/reveiwController');

// still needs to restrict reviewing to onling ams and other things should be for other people
app.get('/', reviewContoller.allReviews);
app
  .route('/am')
  .post(reviewContoller.writeReview)
  .get(reviewContoller.getAmReviews);

app.get('/stats', reviewContoller.statsOfReview);

app.get('/:d', reviewContoller.getReview);

module.exports = app;
