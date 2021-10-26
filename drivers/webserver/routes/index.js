const express = require('express');
const router = express.Router();
const users = require('./user')

router
    .get("/v1/users", users.index)
    .post("/v1/users", users.add)

module.exports = router;