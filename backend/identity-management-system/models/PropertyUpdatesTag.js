const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('propertyupdatestag', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tagID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tags',
        key: 'id'
      }
    },
    updateID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'propertyupdates',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'propertyupdatestag',
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
        name: "tagID",
        using: "BTREE",
        fields: [
          { name: "tagID" },
        ]
      },
      {
        name: "updateID",
        using: "BTREE",
        fields: [
          { name: "updateID" },
        ]
      },
    ]
  });
};
