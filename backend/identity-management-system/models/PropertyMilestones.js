const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('propertymilestones', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roundID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'developmentrounds',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    completionProgress: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mediaId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'propertymilestones',
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
        name: "roundID",
        using: "BTREE",
        fields: [
          { name: "roundID" },
        ]
      },
    ]
  });
};
