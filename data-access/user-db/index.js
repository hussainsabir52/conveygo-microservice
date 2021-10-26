const {
    listUsers,
    addUsers
} = require('./mysql/index')

const userDB = {
    listUsers,
    addUsers
}

module.exports = userDB;