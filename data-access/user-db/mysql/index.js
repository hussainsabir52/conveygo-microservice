

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
    const user = await helper.validateUser(userPayload);
    const insertQuery = "INSERT \
    INTO user \
    SET ?";
    const hashPassword = await bcrypt.hash(user.password, 10);
    user.password = hashPassword;
    const emailCheckQuery = 'SELECT * FROM user WHERE email = ?;';
    const emailResult = await helper.runQuery(emailCheckQuery, user.email);
    if (emailResult.length > 0)
        throw helper.conflict('This email is already registered.');
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
        console.log({
            Message: 'Not Verified',
            userInfo: user
        });
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

    const result = await helper.runQuerySingle(query, email);

    return {
        Message: "Email Successfully Verified",
        verification: true,
    }
}



module.exports = {
    listUsers,
    getUser,
    signUp,
    userLogin,
    emailVerification,
    confirmEmailVerification
}