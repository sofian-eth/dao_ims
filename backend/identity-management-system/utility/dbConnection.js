const Sequelize = require('sequelize');
require('dotenv').config()
// const {DATABASE_PASSWORD,DATABASE_URL,DATABASE_USER,DATABASE_NAME} = require('./keys');

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_URL, dialect: 'mysql', operatorAliases: false,
    dialectOptions: {
        connectTimeout: 60000
      }

    // pool: {
    //     max: 7,
    //     min: 2,
    //     idle: 20000,
    //     acquire: 20000
    // }
})
// sequelize
//     .authenticate()
//     .then(function(err) {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(function (err) {
//         console.log('Unable to connect to the database:', err);
// });

module.exports = sequelize;
global.sequelize = sequelize;