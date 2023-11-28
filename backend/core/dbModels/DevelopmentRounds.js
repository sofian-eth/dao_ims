module.exports = function(sequelize, DataTypes) {
  const developmentrounds = sequelize.define('developmentrounds', {
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
    statusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'status',
        key: 'id'
      }
    },
    roundName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    roundDetails: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    funds: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    pricePerSqft: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lockFundsTx: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    unlockFundsTx: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    discounts: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    marketPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    displayEndDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    displayStartDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'developmentrounds',
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
      {
        name: "statusID",
        using: "BTREE",
        fields: [
          { name: "statusID" },
        ]
      },
    ]
  });
  
  developmentrounds.associate = function (models) {};

  return developmentrounds;
};
