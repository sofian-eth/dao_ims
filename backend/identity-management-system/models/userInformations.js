const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('userInformations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dateOfBirth: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    shippingAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    province: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_kyc_approved: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
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
    paymentMode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'paymentmode',
        key: 'id'
      }
    },
    legalName: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    identityCardNumber: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'userInformations',
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
        name: "statusID",
        using: "BTREE",
        fields: [
          { name: "statusID" },
        ]
      },
      {
        name: "paymentMode",
        using: "BTREE",
        fields: [
          { name: "paymentMode" },
        ]
      },
    ]
  });
};
