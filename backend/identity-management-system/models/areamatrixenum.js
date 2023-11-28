'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AreaMatrixEnum extends Model {
    /** AreaMatrixEnum
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AreaMatrixEnum.belongsToMany(models.property, {through: 'propertyselectionmatrixenum'})
    }
  };
  AreaMatrixEnum.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'areamatrixenum'
  });
  return AreaMatrixEnum;
};