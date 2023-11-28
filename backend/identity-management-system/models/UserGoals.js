'use strict';
const {Model} = require('sequelize');
const models = require('../models');
const User = models.users;
const Company = models.Company;

module.exports = (sequelize, DataTypes) => {
  class UserGoals extends Model {
  
    static associate(models) {
     
    }
  };
  UserGoals.init({
    
    userId: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      references: {
        model: models.users, 
        key: 'id'
      }
    },
    goalId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: models.goalenum, 
        key: 'id'
      }
    }
  
  
  }, {
    sequelize,
    modelName: 'usergoals',
    tableName:'usergoals'
  });
 
  return UserGoals;
};