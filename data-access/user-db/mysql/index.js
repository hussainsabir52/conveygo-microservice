

const helper = require("../../../drivers/webserver/helper/helper");
const bcrypt = require('bcrypt');

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
async function addUsers(userPayload) {
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


module.exports = {
    listUsers,
    addUsers
}