const express = require('express');
const app = express();
const router = express.Router;

const teamleadController = require('../controllers/teamLeadContoller');

app
  .route('/')
  .get(teamleadController.allansweredtickets)
  .get(teamleadController.allunansweredtickets)
  .get(teamleadController.teamLeadAll);

app
  .route('/:id')
  .get(teamleadController.readForm)
  .post(teamleadController.respondToForm);

module.exports = app;
