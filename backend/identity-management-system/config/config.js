// const {
//     DATABASE_USER,
//     DATABASE_PASSWORD,
//     DATABASE_URL,
//     DATABASE_NAME,
//   } = require("../utility/keys");

require('dotenv').config();
console.log(process.env.DATABASE_URL);
  module.exports = {
 
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_URL,
    dialect: "mysql",
    timezone: "+05:00"
  };
  