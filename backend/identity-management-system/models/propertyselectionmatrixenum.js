'use strict';
const {
  Model
} = require('sequelize');
const models = require('../models');
module.exports = (sequelize, DataTypes) => {
  class PropertySelectionMatrixEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  PropertySelectionMatrixEnum.init({ 

    propertyID: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      references: {
        model: models.property, 
        key: 'id'
      }
    },

    areaMatrixID: {
      type: DataTypes.INTEGER,
      primaryKey:true,
      references: {
        model: models.areamatrixenum, 
        key: 'id'
      }
    },
    areaUnits: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'propertyselectionmatrixenum',
  });
  return PropertySelectionMatrixEnum;
};