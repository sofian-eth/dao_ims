const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('marketplaceorders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sellerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    areaUnits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sqftPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    totalCost: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    statusID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'status',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'marketplaceorders',
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
        name: "sellerID",
        using: "BTREE",
        fields: [
          { name: "sellerID" },
        ]
      },
      {
        name: "statusID",
        using: "BTREE",
        fields: [
          { name: "statusID" },
        ]
      },
    ]
  });
};
