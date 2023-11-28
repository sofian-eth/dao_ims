'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class documentEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      documentEnum.hasMany(models.media, {as: 'Documents', foreignKey: 'documentId'});
    }
  };
  documentEnum.init({
    name: DataTypes.STRING,
    bucketId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'documentEnum',
  });
  return documentEnum;
};