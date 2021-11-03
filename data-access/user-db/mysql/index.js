

const helper = require("../../../drivers/webserver/helper/helper");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../../../constants');
const vc = require('../../../utils/verificationCode');
const mail = require('../../../utils/mail')

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
    const selectQuery = "select * from user where userID=?";
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
    user.creationDate = new Date();
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
    const checkPass = bcrypt.compare(password, result.password);

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

async function emailVerification(email) {

}



module.exports = {
    listUsers,
    getUser,
    signUp,
    userLogin
}