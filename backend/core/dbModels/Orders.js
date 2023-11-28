module.exports = function(sequelize, DataTypes) {
  const orders = sequelize.define('orders', {
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
    propertyID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },    
    pricePerSqFt: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    areaToSell: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    areaToList: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minimumLotSize: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    subTotal: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    daysToAcceptPayment: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tokenAmount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    serviceChargesMethod: {
      type: DataTypes.STRING,
      allowNull: false
    },    
    salesTax: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'orders',
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
    ]
  });

  orders.associate = function (models) {
    orders.hasMany(models.orderPaymentMethods)
    //orders.belongsTo(models.property)
  };

  return orders;

};
