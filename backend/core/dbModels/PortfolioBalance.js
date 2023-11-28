const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const portfoliobalance = sequelize.define('portfoliobalance', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
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
    balance: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    netInvestment: {
      type: DataTypes.DECIMAL,
      allowNull: true
    }


  }, {
    sequelize,
    tableName: 'portfoliobalance',
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
        name: "propertyID",
        using: "BTREE",
        fields: [
          { name: "propertyID" },
        ]
      },
    ]
  });

  portfoliobalance.associate = function (models) {
    
    //portfoliobalance.belongsTo(models.users, {foreignKey: 'ownerID'});
    // property.belongsToMany(models.users, {through: 'propertyView'});
    // property.belongsToMany(models.scoreEnum, {through: models.propertyScore});
    // property.belongsToMany(models.riskEnum, {through: models.propertyRisk});

  };

  return portfoliobalance;

};
