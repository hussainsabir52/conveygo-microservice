const {
    listUsers,
    getUser,
    signUp,
    userLogin,
    emailVerification,
    confirmEmailVerification,
    getLocations,
    rideNow,
    pingDriverLocation,
    getRide,
    driverSignup,
    driverVehicleRegistration,
    driverChangeFare,
    userChangeFare,
    getDrivers,
    acceptUserRideNow,
    deliverNow
} = require('./mysql/index')

const userDB = {
    listUsers,
    getUser,
    signUp,
    userLogin,
    emailVerification,
    confirmEmailVerification,
    getLocations,
    rideNow,
    pingDriverLocation,
    getRide,
    driverSignup,
    driverVehicleRegistration,
    driverChangeFare,
    userChangeFare,
    getDrivers,
    acceptUserRideNow,
    deliverNow
}

module.exports = userDB;