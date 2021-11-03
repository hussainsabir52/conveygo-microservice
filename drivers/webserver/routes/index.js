const express = require('express');
const router = express.Router();
const users = require('./user')

router
    .get("/v1/users", users.index)
    .get("/v1/user/:id", users.get)
    .post("/v1/login", users.login)
    .post("/v1/users", users.signUp)


module.exports = router;