/*
    name: SERVER (Main starting Point)
    path: drivers/webserver/server.js
    Objective: This is the main server file, here  we run our server here, error handling and this is the main point to go to the routes file.
    next File: server > routes
*/
const express = require('express');
const app = express();
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
app.use(cors());
let server = http.createServer(app)
const config = require('../../config/index');
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

app.use(routes);


// === BOILERPLATE ===
// Catch and send error messages
app.use((err, req, res, next) => {
  if (err) {
    console.error(err.message);
    if (!err.statusCode) {
      err.statusCode = 500;
    } // Set 500 server code error if status code not set
    return res.status(err.statusCode).send({
      statusCode: err.statusCode,
      message: err.message,
      stack: err.stack,
    });
  }

  next();
});

// when route doent exist it will return a code 404.
app.use(function (req, res) {
  res.status(404).json({
    status: 'Page does not exist',
  });
});


const PORT = config.PORT;

//starting the server
server.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
