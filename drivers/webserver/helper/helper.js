const mySqlHelper = require('./mySqlHelper');
const userSchema = require('../../../models/user/user-schema');
const validatePayLoad = require('../../../models/validator/index');

// Construct a Date object from string of format "MM-DD-YYYY".
function dateFromMMDDYYYYString(dateStr) {
  const [month, day, year] = dateStr.split('-').map((x) => parseInt(x, 10));
  const utc = Date.UTC(year, month - 1, day);
  return new Date(utc);
}

// Construct a Date object from string of format "MM-DD-YYYY".
function MMDDYYYYStringFromDate(date) {
  return [
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCFullYear(),
  ].join('-');
}

function newError(message, statusCode) {
  const err = new Error(message);
  err.statusCode = statusCode;
  console.log(err);
  return err;
}

function badRequest(message = 'Invalid request payload.') {
  return newError(message, 400);
}

function notFound(message) {
  return newError(message, 404);
}

function conflict(message) {
  return newError(message, 409);
}

/**
 * @desc Function to validate payloads according to given schema maker
 * @param {Object} payload The payload to validate
 * @param {Function} maker The schema maker function
 * @returns {Object} The validated payload
 */
function validateSchemaObject(payload, maker) {
  try {
    return maker(payload);
  } catch (e) {
    throw badRequest(e.message);
  }
}
function validate(schema, payload) {
  try {
    return validatePayLoad(schema, payload);
  } catch (error) {
    throw badRequest(error.message);
  }
}
function validateUser(userPayload) {
  return validate(userSchema, userPayload);
}

module.exports = {
  MMDDYYYYStringFromDate,
  dateFromMMDDYYYYString,
  badRequest,
  notFound,
  conflict,
  validateSchemaObject,
  validateUser,
  ...mySqlHelper,
};
