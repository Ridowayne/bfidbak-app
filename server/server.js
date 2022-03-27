const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/config.env' });
const socketio = require('socket.io');
const catchAsync = require('./utils/catchAsync');

// dotenv.config({ path: './config.env' });
const app = require('./app');

const server = require('http').createServer(app);
const io = socketio(server);

const db = process.env.DB;

mongoose.connect(db, {}).then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server up and runnnig on ${port}...`));
