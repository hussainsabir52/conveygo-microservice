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
    driverChangeFare
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
    driverChangeFare
}

module.exports = userDB;