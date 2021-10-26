/*
    name: SQL CONNECTOR
    path: db/mysql/connection.js
    Objective: In this file we made the connection of mySQL database with our server.
*/

const mysql = require('mysql');
const config = require('../../config/index');
const db = mysql.createPool({
  connectionLimit: 2,
  host: config.MYSQL.HOST,
  user: config.MYSQL.USER,
  password: config.MYSQL.PASSWORD,
  database: config.MYSQL.DATABASE,
  timezone: 'utc',
});
db.Promise = global.Promise;
global.db = db;

module.exports = db;
