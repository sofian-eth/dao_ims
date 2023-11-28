const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('accountactivity', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    subjectID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'lov',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    IPAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    browser: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    operatingSystem: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'accountactivity',
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
        name: "userID",
        using: "BTREE",
        fields: [
          { name: "userID" },
        ]
      },
      {
        name: "subjectID",
        using: "BTREE",
        fields: [
          { name: "subjectID" },
        ]
      },
    ]
  });
};
