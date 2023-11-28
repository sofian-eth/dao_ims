const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('propertypricehistory', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    propertyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    propertyValue: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'propertypricehistory',
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
};
