const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('propertytaxes', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    taxID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'taxestype',
        key: 'id'
      }
    },
    propertyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'propertytaxes',
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
        name: "taxID",
        using: "BTREE",
        fields: [
          { name: "taxID" },
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
};
