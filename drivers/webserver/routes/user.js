const userDB = require("../../../data-access/user-db");

const users = (module.exports = {});

users.index = (req, res, next) => {
    userDB.listUsers().then((data) => {
        res.send(data);
    }).catch(next);
};

users.get = (req, res, next) => {
    userDB.getUser().then((data) => {
        res.send(data);
    }).catch(next);
};

users.signUp = (req, res, next) => {
    userDB.signUp(req.body).then((data) => {
        res.send(data);
    }).catch(next);
};

users.login = async (req, res, next) => {
    try {
        const data = await userDB.userLogin(req.body);
        console.log(data);
        res.send(data);
    }
    catch (err) {
        next(err);
    }
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
