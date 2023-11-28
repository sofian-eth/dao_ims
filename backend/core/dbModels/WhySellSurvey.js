const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const whySellSurvey = sequelize.define('whySellSurvey', {
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
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'whySellSurvey',
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
      }
    ]
  });

  whySellSurvey.associate = function (models) {
    
  };

  return whySellSurvey;

};
