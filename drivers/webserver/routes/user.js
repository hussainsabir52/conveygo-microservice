const userDB = require('../../../data-access/user-db')

const users = (module.exports = {});

users.index = (req, res) => {
    userDB.listUsers().then((data) => {
        res.send(data);
    });
}

users.add = (req, res) => {
    userDB.addUsers(req.body).then((data) => {
        res.send(data);
    });
}