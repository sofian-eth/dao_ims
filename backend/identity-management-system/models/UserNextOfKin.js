'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserNextOfKin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserNextOfKin.init({
    cnic: DataTypes.STRING,
    address: DataTypes.STRING,
    fullName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    smsNotification: DataTypes.INTEGER,
    pushNotification: DataTypes.INTEGER,

    profile: DataTypes.STRING,
    portfolioBalance: DataTypes.FLOAT,
    email: DataTypes.STRING,
    isDeleted:DataTypes.BOOLEAN,
    userID: { 
      type:DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'userNextOfKin',
    tableName: 'userNextOfKin'
  });
  return UserNextOfKin;
};