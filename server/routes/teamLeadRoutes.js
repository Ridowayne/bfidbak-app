const express = require('express');
const app = express();
const router = express.Router();

const teamleadController = require('../controllers/teamLeadContoller');
router.get('/answered', teamleadController.allansweredtickets);

app.route('/').get(teamleadController.allunansweredtickets);
app
  .route('/:id')
  .get(teamleadController.readForm)
  .patch(teamleadController.respondToForm);

module.exports = app;
