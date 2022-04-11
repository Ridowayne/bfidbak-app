const express = require('express');
const app = express();
const router = express.Router();

const management = require('../controllers/managementContoller');
router.get('/answered', management.allansweredtickets);

app.route('/').get(management.allunansweredtickets);

app.route('/:id').get(management.readForm).patch(management.respondToForm);

module.exports = app;
