'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
require('dotenv').config()
let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);  
// }
const dbName = process.env.DATABASE_NAME || process.env.database;
const dbuser = process.env.DATABASE_USER || process.env.dbusername;
const dbpass = process.env.DATABASE_PASSWORD || process.env.dbpassword;
const url = process.env.DATABASE_URL || process.env.url;

sequelize = new Sequelize(dbName, dbuser, dbpass, {
  host: url, dialect: 'mysql', operatorAliases: false,
  dialectOptions: {
    connectTimeout: 60000
  }
})


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
