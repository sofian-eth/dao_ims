'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class userInvestment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  userInvestment.init({
    userID: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model:'user', 
        key: 'id'
      }
    },
    investmentID: {
      type:DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model:'investmentEnum', 
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'userInvestment',
    tableName: 'userInvestment'
  });
  return userInvestment;
};