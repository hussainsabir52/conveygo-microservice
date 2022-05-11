const {
    listUsers,
    getUser,
    signUp,
    userLogin,
    emailVerification,
    confirmEmailVerification,
    getLocations,
    rideNow
} = require('./mysql/index')

const userDB = {
    listUsers,
    getUser,
    signUp,
    userLogin,
    emailVerification,
    confirmEmailVerification,
    getLocations,
    rideNow
}

module.exports = userDB;