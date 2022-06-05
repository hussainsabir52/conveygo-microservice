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
    .post("/v1/user-fare", users.userChangeFare)
    .post("/v1/get-drivers", users.getDrivers)
    .post("/v1/accept-ride-user", users.acceptUserRideNow)
    .post("/v1/deliver-now", users.deliverNow)
    .post("/v1/driver-fare-delivery", users.driverChangeFareDelivery)
    .post("/v1/user-fare-delivery", users.userChangeFareDelivery)
    .post("/v1/get-drivers-delivery", users.getDriversDelivery)
    .post("/v1/accept-ride-user-delivery", users.acceptUserDelivery)
    .post("/v1/monthly-booking", users.monthlyBooking)
    .post("/v1/driver-fare-monthly", users.driverChangeFareMonthly)
    .post("/v1/user-fare-monthly", users.userChangeFareMonthly)
    .post("/v1/get-drivers-monthly", users.getDriversMonthly)
    .post("/v1/accept-ride-user-monthly", users.acceptUserMonthly)

module.exports = router;