const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const amRoutes = require('./routes/amRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const engineeringRoutes = require('./routes/engineeringRoutes');
const hrRoutes = require('./routes/hrRoutes');
const teamLeadRoutes = require('./routes/teamLeadRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const managementRoutes = require('./routes/managementRoutes');
const iTRoutes = require('./routes/iTRoutes');

const { restrictTo } = require('./controllers/authController');
const { protect } = require('./controllers/authController');

const globalErrorHandler = require('./controllers/errorContoller');

// middlewares
// app.use(express.json({ limit: '50kb' }));
// app.use(express.static(path.join(__dirname, 'public')))

// app.use(bodyParser.json({ type: 'application/json' }));
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json()); //For JSON requests
app.use(express.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
  res.send('welcome to bfree feedback app, YOLO');
});

app.use('/api/v1/agents/forms', protect, restrictTo('AM', 'Admin'), amRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/admin', protect, restrictTo('admin', 'Admin'), adminRoutes);
app.use(
  '/api/v1/engineering',
  protect,
  restrictTo('Engineering', 'Admin'),
  engineeringRoutes
);
app.use('/api/v1/hr', protect, restrictTo('HR', 'Admin'), hrRoutes);
app.use('/api/v1/IT', protect, restrictTo('IT', 'Admin'), iTRoutes);
app.use(
  '/api/v1/management',
  protect,
  restrictTo('Management'),
  managementRoutes
);
app.use('/api/v1/teamLead', protect, restrictTo('Team Lead'), teamLeadRoutes);

// this is for any unhandled routes requested for
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `can not get ${req.originalUrl} on the server`,
  });
  next(new ErrorResponse(`can not get ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
