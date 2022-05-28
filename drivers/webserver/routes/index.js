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
    .get("/v1/locations", users.getLocations)
    .post("/v1/ride-now", users.rideNow)
    .post("/v1/ping-driver-location", users.pingDriverLocation)
    .post("/v1/get-rides", users.getRide)
    .post("/v1/driver-signup", users.driverSignup)
    .post("/v1/driver-register", users.driverVehicleRegistration)
    .post("/v1/driver-fare", users.driverChangeFare)

module.exports = router;