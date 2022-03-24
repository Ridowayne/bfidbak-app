const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json({ limit: '10kb' }));
// app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('welcome to bfree feedback app, YOLO');
});

module.exports = app;
