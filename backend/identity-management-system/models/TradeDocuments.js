const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tradedocuments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tradeID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tradeactivity',
        key: 'id'
      }
    },
    documentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documents',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'tradedocuments',
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
        name: "tradeID",
        using: "BTREE",
        fields: [
          { name: "tradeID" },
        ]
      },
      {
        name: "documentID",
        using: "BTREE",
        fields: [
          { name: "documentID" },
        ]
      },
    ]
  });
};
