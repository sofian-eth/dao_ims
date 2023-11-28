'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BankInformationEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  BankInformationEnum.init({
    bankName: DataTypes.STRING,
    accountTitle: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    IBAN: DataTypes.STRING,
    branch: DataTypes.STRING,
    propertyID: { 
      type:DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'property',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'bankinformationenum',
  });
  return BankInformationEnum;
};