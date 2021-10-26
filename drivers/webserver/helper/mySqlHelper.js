const mysql = require('mysql');
const pool = require('../../../db/mysql/connection'); // DB

function logQuery(query, args) {
  console.log('Running query: \n');
  console.log(mysql.format(query, args) + '\n');
}

// Execute a MySQL query and return rows.
function runQueryOnConnection(query, values, connection) {
  return new Promise(function (resolve, reject) {
    logQuery(query, values);
    connection.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function beginTransaction(connection) {
  return new Promise((resolve, reject) => {
    connection.beginTransaction((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function rollback(connection) {
  return new Promise((resolve, reject) => {
    connection.rollback((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function commit(connection) {
  return new Promise((resolve, reject) => {
    connection.commit((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function getConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) reject(err);
      else resolve(connection);
    });
  });
}

// Execute a MySQL query and return the first result row.
async function runQuerySingle(query, values) {
  const queryResult = await runQuery(query, values);
  return queryResult[0];
}

// Execute a MySQL query and return rows.
function runQuery(query, values) {
  return new Promise(function (resolve, reject) {
    logQuery(query, values);
    pool.query(query, values, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function runTransaction(consumerFunc) {
  const connection = await getConnection();
  try {
    await beginTransaction(connection);

    const runQuery = (query, args) => {
      return runQueryOnConnection(query, args, connection);
    };

    await consumerFunc(runQuery);
    console.log('Committing Transaction');
    await commit(connection);
  } catch (err) {
    console.log('Rolling back Transaction...');
    await rollback(connection);
    console.error(err);
    throw err;
  } finally {
    connection.release();
  }
}

module.exports = {
  runQueryOnConnection,
  beginTransaction,
  rollback,
  commit,
  getConnection,
  runQuerySingle,
  runQuery,
  runTransaction,
};
