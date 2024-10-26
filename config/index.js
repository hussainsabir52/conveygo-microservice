require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MYSQL: {
    HOST: process.env.MYSQL_HOST ?? throwMissing('MYSQL_HOST'),
    DATABASE: process.env.MYSQL_DATABASE ?? throwMissing('MYSQL_DATABASE'),
    USER: process.env.MYSQL_USER ?? throwMissing('MYSQL_USER'),
    PASSWORD: process.env.MYSQL_PASSWORD ?? throwMissing('MYSQL_PASSWORD'),
  },
  MAIL: {
    SERVICE: 'gmail',
    EMAIL: 'giroapp2021@gmail.com',
    PASSWORD: 'HMHgiro2021',
    EMAIL_CONFIRMATION_SUBJECT: 'Giro Email Confirmation'
  }
};

function throwMissing(evnVar) {
  throw new Error('Missing environment variable: ' + evnVar);
}
