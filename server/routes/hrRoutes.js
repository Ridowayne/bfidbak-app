const express = require('express');
const app = express();
const router = express.Router();

const hrContoller = require('../controllers/hrController');

app.route('/:id').get(hrContoller.readForm).patch(hrContoller.respondToForm);
router.get('/answered', hrContoller.allansweredtickets);

app.route('/').get(hrContoller.allunansweredtickets);

module.exports = app;
