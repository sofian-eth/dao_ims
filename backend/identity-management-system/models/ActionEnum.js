'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ActionEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ActionEnum.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ActionEnum',
  });
  return ActionEnum;
};