const {
    listUsers,
    getUser,
    signUp,
    userLogin
} = require('./mysql/index')

const userDB = {
    listUsers,
    getUser,
    signUp,
    userLogin
}

module.exports = userDB;