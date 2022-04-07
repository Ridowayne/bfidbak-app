const express = require('express');
const app = express();
const router = express.Router;

const engineeringContoller = require('../controllers/engineeringController');
const { restrictTo } = require('../controllers/authController');

app.use(restrictTo('Engineering'));

app
  .route('/:id')
  .get(engineeringContoller.readForm)
  .patch(engineeringContoller.respondToForm);

app
  .route('/')
  .get(engineeringContoller.allansweredtickets)
  .get(engineeringContoller.allunansweredtickets)
  .get(engineeringContoller.engineeringAll);

module.exports = app;
