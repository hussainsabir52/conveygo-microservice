module.exports = {
    authCode(length = 8) {
        return Math.random().toString(36).substring(2, length);
    }
};