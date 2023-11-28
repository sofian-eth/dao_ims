const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const propertygallery =  sequelize.define('propertygallery', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    imageURL: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    propertyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    mediaID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'media',
        key: 'id'
      }
    },

    videoid:{
      type: DataTypes.STRING,
    }



  }, {
    sequelize,
    tableName: 'propertygallery',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "propertyID",
        using: "BTREE",
        fields: [
          { name: "propertyID" },
        ]
      },
    ]
  });

  propertygallery.associate = function (models) {

    propertygallery.belongsTo(models.media);

  };

  return propertygallery;

};
