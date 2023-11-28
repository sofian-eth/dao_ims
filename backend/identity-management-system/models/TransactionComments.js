'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionComments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  TransactionComments.init({
    comment: DataTypes.STRING,
     tradeId: { 
      type:DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tradeactivity',
        key: 'id'
      }
    },
    userId: { 
        type:DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      }
  }, {
    sequelize,
    modelName: 'transactionComments',
    tableName: 'transactionComments'
  });
  return TransactionComments;
};