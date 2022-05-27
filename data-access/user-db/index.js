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
    driverSignup
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
    driverSignup
}

module.exports = userDB;