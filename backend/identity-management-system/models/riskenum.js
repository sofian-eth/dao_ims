'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class riskEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      riskEnum.belongsToMany(models.property, {through: models.propertyRisk});
    }
  };
  riskEnum.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'riskEnum',
  });
  return riskEnum;
};