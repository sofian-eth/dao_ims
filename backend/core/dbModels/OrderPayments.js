module.exports = function(sequelize, DataTypes) {
  const orderPayments = sequelize.define('orderPayments', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    parentID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'orderPayments',
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
        name: "orderItemID",
        using: "BTREE",
        fields: [
          { name: "orderItemID" },
        ]
      },
    ]
  });

  orderPayments.associate = function (models) {
    //orderPayments.belongsTo(models.orderItems)
  };

  return orderPayments;
};
