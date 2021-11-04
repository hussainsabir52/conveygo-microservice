/*
    name: User SCHEMA
    path: models/User/user-schema.js
    Objective: In this we validate each field of user schema.
    next File: user-schema > index
*/

const Joi = require('joi');

module.exports = Joi.object().keys({
    firstName: Joi.string().required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    email: Joi.string().required(),
    mobile: Joi.string().required(),
    password: Joi.string().required(),
    creationDate: Joi.string().required(),
    // imageURL: Joi.string().optional(),
    isEmailVerified: Joi.number().required(),
    type: Joi.number().required()

});
