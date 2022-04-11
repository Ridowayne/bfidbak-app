const express = require('express');
const app = express();
const router = express.Router();

const iTContoller = require('../controllers/iTController');
router.get('/answered', iTContoller.allansweredtickets);
app.route('/').get(iTContoller.allunansweredtickets);

app.route('/:id').get(iTContoller.readForm).patch(iTContoller.respondToForm);

module.exports = app;
