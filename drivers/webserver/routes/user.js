const userDB = require("../../../data-access/user-db");

const users = (module.exports = {});

users.index = (req, res) => {
    userDB.listUsers().then((data) => {
        res.send(data);
    });
};

users.get = (req, res) => {
    userDB.getUser().then((data) => {
        res.send(data);
    });
};

users.signUp = (req, res) => {
    userDB.signUp(req.body).then((data) => {
        res.send(data);
    });
};

users.login = (req, res) => {
    userDB.userLogin(req.body).then((data) => {
        res.send(data);
    });
};
