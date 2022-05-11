const userDB = require("../../../data-access/user-db");

const users = (module.exports = {});

users.index = (req, res, next) => {
    userDB.listUsers().then((data) => {
        res.send(data);
    }).catch(next);
};

users.get = (req, res, next) => {
    userDB.getUser(req.params['id']).then((data) => {
        res.send(data);
    }).catch(next);
};

users.signUp = (req, res, next) => {
    userDB.signUp(req.body).then((data) => {
        res.send(data);
    }).catch(next);
};

users.login = async (req, res, next) => {
    userDB.userLogin(req.body).then((data) => {
        res.send(data);
    }).catch(next)
};

users.verifyemail = (req, res, next) => {
    userDB.emailVerification(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.confirmemail = (req, res, next) => {
    userDB.confirmEmailVerification(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.getLocations = (req, res, next) => {
    userDB.getLocations().then((data) => {
        res.send(data);
    }).catch(next);
}

users.rideNow = (req, res, next) => {
    console.log(req);
    userDB.rideNow(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}