

const helper = require("../../../drivers/webserver/helper/helper");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../../../constants');
const vc = require('../../../utils/verificationCode');
const nodemailer = require('nodemailer');
const config = require("../../../config");

/*
objective: function to get all users
Input: not required
Output: array of all users
description: after query execution it will Send the data to serializer
*/
async function listUsers() {
    const selectQuery = "select * from user";
    const result = await helper.runQuery(selectQuery);
    return result;
}

/*
objective: function to get user
Input: userID
Output: user Info
description: after query execution it will Send the data to serializer
*/
async function getUser(userID) {
    const selectQuery = "select * from user where userID = ?";
    const result = await helper.runQuery(selectQuery, userID);
    return result;
}


/*
objective: function to add user
Input: user payload
Output: inserted user
description: after query execution it will Send the data to serializer
*/
async function signUp(userPayload) {
    userPayload.isEmailVerified = 0;
    const user = await helper.validateUser(userPayload);
    const insertQuery = "INSERT \
    INTO user \
    SET ?";
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword;
    const emailCheckQuery = 'SELECT * FROM user WHERE email = ? or mobile=?;';
    const emailResult = await helper.runQuery(emailCheckQuery, [user.email, user.mobile]);
    if (emailResult.length > 0)
        throw helper.conflict('This email or mobile number is already registered.');
    const result = await helper.runQuery(insertQuery, user);
    return getUser(result.insertId);
}

/*
objective: function to check user login
Input: user email & user password
Output: user info
description: after query execution it will Send the data to serializer
*/

async function userLogin(userPayload) {
    const { email, password } = userPayload;
    console.log(email, password);
    if (!email || !password) { throw helper.badRequest(); }

    const query = 'select * from user where email=? and type=?';

    const result = await helper.runQuerySingle(query, [email, constants.User]);

    if (!result) {
        throw helper.conflict('The email is incorrect.');
    }
    console.log(password, result.password);
    const checkPass = await bcrypt.compare(password, result.password);
    console.log(checkPass);
    if (!checkPass) {
        throw helper.conflict('The password is incorrect');
    }

    const user = new Object({
        userID: result.userID,
        firstName: result.firstName,
        middleName: result.middleName,
        lastName: result.lastName,
        email: result.email,
        mobile: result.mobile,
        imageURL: result.imageURL,
        isEmailVerified: result.isEmailVerified,
        userType: result.type,
        creationDate: result.creationDate
    });
    if (result.isEmailVerified == 0) {
        return {
            Message: 'Not Verified',
            userInfo: user
        };
    }
    return {
        Message: 'Auth Successful',
        userInfo: user
    };

}

/*
objective: function to send verification code using email
Input: user email
Output: verification code
description: after query execution it will Send the data to serializer
*/

async function emailVerification(payload) {
    const { email } = payload;
    var transporter = nodemailer.createTransport({
        service: config.MAIL.SERVICE,
        auth: {
            user: config.MAIL.EMAIL,
            pass: config.MAIL.PASSWORD
        }
    });
    const code = vc.authCode(10);
    var mailOptions = {
        from: config.MAIL.EMAIL,
        to: email,
        subject: config.MAIL.EMAIL_CONFIRMATION_SUBJECT,
        text: `Your Giro Mobile App Verification Code is: ${code}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Verification Email sent: ' + info.response);
        }
    });

    return {
        code
    }
}

async function confirmEmailVerification(payload) {
    const { email } = payload;

    const query = 'update user set isEmailVerified=1 where email=?';

    await helper.runQuerySingle(query, email);

    return {
        Message: "Email Successfully Verified",
        verification: true,
    }
}

async function getLocations() {
    const query = "select * from location";
    const result = await helper.runQuery(query);
    return result;
}

async function rideNow(payload) {
    console.log(payload);
    const { user_id, to_location, from_location, fare } = payload;
    var query = `insert into ride_now set user_id=${user_id} ,to_location=${to_location} ,from_location=${from_location},fare=${fare}`;
    var result = await helper.runQuery(query);
    const rideid = result.insertId;
    query = `insert into ride_info(ride_id,ride_type_id) values(${result.insertId},1)`;
    result = await helper.runQuery(query);
    return { rideId: rideid };
}

async function pingDriverLocation(payload) {
    const { driver_id, latitude, longitude } = payload;
    const query1 = `delete from driver_location where driver_id=${driver_id}`;
    await helper.runQuery(query1);
    const query = `insert into driver_location set latitude=${latitude}, longitude=${longitude} where driver_id=${driver_id}`;
    const result = await helper.runQuery(query);
    return result;
}

async function getRide(payload) {
    const { driver_id } = payload;
    const query1 = `select latitude, longitude from driver_location where driver_id=${driver_id}`;
    const query2 = `select 
    rn.ride_id,
    concat(u.firstName," ",u.middleName," ",u.lastName) as "userName" , 
    rn.fare, rt.ride_type_name as "rideType", 
    loc.address as "pickup", 
    loc.latitude as "pickupLatitude",
    loc.longitude as "pickupLongitude", 
    loc1.address as "Dropoff", 
    loc1.latitude as "dropoffLatitude",
    loc1.longitude as "dropoffLongitude"
    from ride_now as rn 
    inner join ride_info as ri on ri.ride_id = rn.ride_id 
    inner join ride_type as rt on rt.ride_type_id = ri.ride_type_id
    inner join location as loc on rn.from_location=loc.locId
    inner join location as loc1 on rn.to_location=loc1.locId
    inner join user as u on u.userID = rn.user_id;`
    var rides = [];
    const result1 = await helper.runQuerySingle(query1);
    const result2 = await helper.runQuery(query2);
    console.log(result1);
    console.log(result2);
    let distances = [];
    for (var i = 0; i < result2.length; i++) {
        let lat1 = result1?.latitude;
        let lat2 = result2[i]?.pickupLatitude;
        let lon1 = result1?.longitude;
        let lon2 = result2[i]?.pickupLongitude;
        if ((lat1 == lat2) && (lon1 == lon2)) {
            distances.push(0);
        }
        else {
            var radlat1 = Math.PI * lat1 / 180;
            var radlat2 = Math.PI * lat2 / 180;
            var theta = lon1 - lon2;
            var radtheta = Math.PI * theta / 180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344
            distances.push(dist);
            if (dist < 4) {
                rides.push(result2[i]);
            }
        }
    }
    return { rides };
}

async function driverSignup(payload) {
    let { name, contact, email, password } = payload;
    const query = `select * from driver where email=?`;
    const result1 = await helper.runQuery(query, email);
    console.log(result1);
    if (result1.length > 0) {
        return { Message: "Already Registered", Error: 1 }
    } else {
        const hashPassword = await bcrypt.hash(password, 10);
        password = hashPassword;
        const query = `insert into driver(driver_name,email,password,contact_number) values(?,?,?,?)`;
        const result = await helper.runQuery(query, [name, email, password, contact]);
        return { Message: "Successfully Registered", driverID: result.insertId };
    }
}

async function driverVehicleRegistration(payload) {
    const { driverId, driverAddress, driverLicenseNumber, driverCnicNumber, vechicleType, vehicleNumber, regCity, regYear, modelYear, make, ownerName } = await payload;
    const query = `select * from driver where driverID = ${driverId}`;
    const driverInfo = await helper.runQuery(query);
    if (driverInfo.length < 1) {
        return { Message: "Driver Not Found", Error: 1 };
    }
    else {
        try {
            const query1 = `update driver set address=?, licenseNumber=?, cnicNumber=? where driverID=?`;
            await helper.runQuery(query1, [driverAddress, driverLicenseNumber, driverCnicNumber, driverId]);
            const query2 = `insert into vehicle(type,vehicleNumber,registration_city,registration_year, model_year,owner_name,make,driverID) values(?,?,?,?,?,?,?,?);`
            const result = await helper.runQuery(query2, [vechicleType, vehicleNumber, regCity, regYear, modelYear, ownerName, make, driverId]);
            if (result.insertId) {
                return { Message: 'Driver Registered', Error: 0 };
            }
        } catch (err) {
            return { Message: 'Error', Error: err };
        }
    }
}


module.exports = {
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
    driverSignup,
    driverVehicleRegistration
}