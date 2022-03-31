const express = require('express');
const app = express();
const router = express.Router;

const hrContoller = require('../controllers/hrController');
const { restrictTo } = require('../controllers/authController');

app.use(restrictTo('admin'));

app.route('/:id').get(hrContoller.readForm).post(hrContoller.respondToForm);

app
  .route('/')
  .get(hrContoller.allansweredtickets)
  .get(hrContoller.allunansweredtickets)
  .get(hrContoller.hrAll);

module.exports = app;
