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

function calcDistance(lat1, lon1, lat2, lon2, unit) {
  if ((lat1 == lat2) && (lon1 == lon2)) {
    return 0;
  }
  else {
    var radlat1 = Math.PI * lat1 / 180;
    var radlat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radtheta = Math.PI * theta / 180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist;
  }
}


module.exports = {
  MMDDYYYYStringFromDate,
  dateFromMMDDYYYYString,
  badRequest,
  notFound,
  conflict,
  validateSchemaObject,
  validateUser,
  calcDistance,
  ...mySqlHelper,
};
