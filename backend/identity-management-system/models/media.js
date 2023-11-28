'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class media extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      //media.belongsTo(models.documentEnum);
      media.hasMany(models.propertygallery, {as: 'PropertyGalleries'})

    }
  };
  media.init({
    fileName: DataTypes.STRING,
    originalFileName: DataTypes.STRING,
    relativePath: DataTypes.STRING,
    description: DataTypes.STRING,
    isImage: DataTypes.BOOLEAN,   
    documentId: DataTypes.INTEGER,
    extension: DataTypes.STRING,
    size: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'media',
  });
  return media;
};