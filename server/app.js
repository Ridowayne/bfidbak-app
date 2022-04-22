const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const xss = require('xss-clean');
const hpp = require('hpp');

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

const app = express();

// middlewares
// app.use(express.static(path.join(__dirname, 'public')))

// app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(compression()); //Compress all routes

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// hpp, rate-limit, helmet, xss-clean, mongo-saitize
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//
//     ]
//   })
// );

// routes
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/index.html');
});
// app.get('/', (req, res) => {
//   res.send('welcome to bfree feedback app, YOLO');
// });

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
app.use('/api/v1/reviews', protect, reviewRoutes);
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
