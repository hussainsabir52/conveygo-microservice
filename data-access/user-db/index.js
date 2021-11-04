const {
    listUsers,
    getUser,
    signUp,
    userLogin,
    emailVerification,
    confirmEmailVerification
} = require('./mysql/index')

const userDB = {
    listUsers,
    getUser,
    signUp,
    userLogin,
    emailVerification,
    confirmEmailVerification
}

module.exports = userDB;