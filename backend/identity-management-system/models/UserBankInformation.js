'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserBankInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserBankInformation.init({
    bankName: DataTypes.STRING,
    accountTitle: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    iban: DataTypes.STRING,
    branch: DataTypes.STRING,
    userID: { 
      type:DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'userBankInformation',
    tableName: 'userBankInformation'
  });
  return UserBankInformation;
};