const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/config.env' });
const socketio = require('socket.io');

const app = require('./app');

const server = require('http').createServer(app);
const io = socketio(server);

io.of('/api/socket').on('connection', (socket) => {
  console.log('socket.io: User connected: ', socket.id);

  socket.on('disconnect', () => {
    console.log('socket.io: User disconnected: ', socket.id);
  });
});

//start the server
const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server now running on port ${port}!`));

// Database connection
const db = process.env.DB;

mongoose
  .connect(db, {})
  .then(() => console.log(' Initial DB connection successful!'));

const connection = mongoose.connection;

connection
  .once('open', () => {
    console.log('MongoDB database connected');

    const formsChangeStream = connection.collection('forms').watch();
    console.log('Setting change streams');

    formsChangeStream.on('change', (change) => {
      switch (change.operationType) {
        case 'insert':
          const form = {
            _id: change.fullDocument._id,
            name: change.fullDocument.name,
            to: change.fullDocument.to,
            subject: change.fullDocument.subject,
            body: change.fullDocument.body,
          };
          console.log('seems working', form);

          io.of('/api/socket').emit('newform', form);
          break;

        case 'update':
          io.of('/api/socket').emit('answeredform', change.documentKey._id);
          break;
      }
    });
  })
  .on('error', (e) => {
    console.error('watcher died');
  });

connection.on('error', (error) => console.log('Error: ' + error));
