const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('propertystats', {
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
    rentalYield: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ROR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    equityMultiple: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    assetLiquidation: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    capitalGrowth: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    netRentalReturn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    investmentPeriod: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    estimatedIRR: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    minInvestment: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    fundingRounds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    expectedgrowthrate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    guaranteedgrowthrate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    marketriskgrowthrate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    expectedmaturitydate: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    propertytype: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    discount: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    
      minArea: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      maxArea: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      completionArea: {
        type: DataTypes.STRING(255),
        allowNull: true
      },

  }, {
    sequelize,
    tableName: 'propertystats',
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
