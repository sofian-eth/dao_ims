'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAddressBook extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserAddressBook.init({
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    isShipping: DataTypes.INTEGER,
    userID: { 
      type:DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    addressType: {
      type: DataTypes.ENUM,
      allowNull: true,
      values: [
        'Home',
        'Office',
        'Other'
      ]
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'userAddressBook',
    tableName: 'userAddressBook',
    freezeTableName: true,
  });
  return UserAddressBook;
};