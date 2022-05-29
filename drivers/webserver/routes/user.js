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

users.pingDriverLocation = (req, res, next) => {
    userDB.pingDriverLocation(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.getRide = (req, res, next) => {
    userDB.getRide(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.driverSignup = (req, res, next) => {
    userDB.driverSignup(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.driverVehicleRegistration = (req, res, next) => {
    userDB.driverVehicleRegistration(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.driverChangeFare = (req, res, next) => {
    userDB.driverChangeFare(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.userChangeFare = (req, res, next) => {
    userDB.userChangeFare(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}


users.getDrivers = (req, res, next) => {
    userDB.getDrivers(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}

users.acceptUserRideNow = (req, res, next) => {
    userDB.acceptUserRideNow(req.body).then((data) => {
        res.send(data);
    }).catch(next);
}