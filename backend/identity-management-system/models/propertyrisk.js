'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class propertyRisk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  propertyRisk.init({
    propertyID: DataTypes.INTEGER,
    riskID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'propertyRisk',
  });
  return propertyRisk;
};