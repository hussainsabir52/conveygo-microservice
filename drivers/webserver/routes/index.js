const express = require('express');
const router = express.Router();
const users = require('./user')

router
    .get("/v1/users", users.index)
    .get("/v1/user/:id", users.get)
    .post("/v1/login", users.login)
    .post("/v1/signup", users.signUp)
    .post("/v1/verifyemail", users.verifyemail)
    .post("/v1/confirmemail", users.confirmemail)

module.exports = router;