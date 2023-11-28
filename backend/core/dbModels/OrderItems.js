module.exports = function(sequelize, DataTypes) {
  const orderItems = sequelize.define('orderItems', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    areaPurchased: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subTotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tax: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    serviceCharges: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Total: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },    
    tokenAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    orderID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
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
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'orderItems',
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
        name: "BankaccountID",
        using: "BTREE",
        fields: [
          { name: "BankaccountID" },
        ]
      },
    ]
  });

  orderItems.associate = function (models) {
    //orderItems.belongsTo(models.userBankInformation)
  };

  return orderItems;
};
