const express = require('express');
const app = express();
const router = express.Router;

const management = require('../controllers/managementContoller');

app
  .route('/')
  .get(management.allansweredtickets)
  .get(management.allunansweredtickets)
  .get(management.managementAll);

app.route('/:id').get(management.readForm).post(management.respondToForm);

module.exports = app;
