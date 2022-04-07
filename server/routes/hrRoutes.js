const express = require('express');
const app = express();
const router = express.Router;

const hrContoller = require('../controllers/hrController');

app.route('/:id').get(hrContoller.readForm).patch(hrContoller.respondToForm);

app
  .route('/')
  .get(hrContoller.allansweredtickets)
  .get(hrContoller.allunansweredtickets)
  .get(hrContoller.hrAll);

module.exports = app;
