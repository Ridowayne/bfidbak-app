const express = require('express');
const app = express();
const router = express.Router();

const engineeringContoller = require('../controllers/engineeringController');
const { restrictTo } = require('../controllers/authController');

app.use(restrictTo('Engineering'));

router.get('/answered', engineeringContoller.allansweredtickets);

app.get('/', engineeringContoller.allunansweredtickets);
app
  .route('/:id')
  .get(engineeringContoller.readForm)
  .patch(engineeringContoller.respondToForm);

module.exports = app;
