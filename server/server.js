const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const socketio = require("socket.io");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const server = require("http").createServer(app);
const io = socketio(server);

const db = process.env.DB;
mongoose
  .connect(db, {})
  .then(console.log("Connected to the database sucessfully"));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`server up and runnnig on ${port}...`));
