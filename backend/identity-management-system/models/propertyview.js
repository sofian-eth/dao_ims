'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class propertyView extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  propertyView.init({
    isInterested: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'propertyView',
  });
  return propertyView;
};