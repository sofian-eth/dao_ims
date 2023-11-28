const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bidders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    orderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'marketplaceorders',
        key: 'id'
      }
    },
    buyerID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sqftPrice: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'bidders',
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
        name: "orderID",
        using: "BTREE",
        fields: [
          { name: "orderID" },
        ]
      },
      {
        name: "buyerID",
        using: "BTREE",
        fields: [
          { name: "buyerID" },
        ]
      },
    ]
  });
};
