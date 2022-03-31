const express = require('express');
const app = express();
const router = express.Router;

const adminController = require('../controllers/adminController');
const { restrictTo } = require('../controllers/authController');

app.use(restrictTo('admin'));

app.get('/:id', adminController.getFeedback);

app
  .route('/')
  .get(adminController.answeredTickets)
  .get(adminController.getAllFeedbacks)
  .get(adminController.getreveiews)
  .get(adminController.ratingsAndReviwsStats)
  .get(adminController.unansweredTickets);

module.exports = app;
