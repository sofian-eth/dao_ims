module.exports = function(sequelize, DataTypes) {
  const orderPaymentMethods = sequelize.define('orderPaymentMethods', {
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
        model: 'orders',
        key: 'id'
      }
    },
    BankaccountID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'userBankInformation',
        key: 'id'
      }
    },
  }, {
    sequelize,
    tableName: 'orderPaymentMethods',
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

  orderPaymentMethods.associate = function (models) {
    //orderPaymentMethods.belongsTo(models.userBankInformation)
  };

  return orderPaymentMethods;
};
