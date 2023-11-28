const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tradeactivity', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    agentID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    sellerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    buyerID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    roundID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'developmentrounds',
        key: 'id'
      }
    },
    blockchainReference: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    billingAddress: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    areaPledged: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true
    },
    totalPrice: {
      type: DataTypes.DECIMAL(20,4),
      allowNull: true
    },
    propertyID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'property',
        key: 'id'
      }
    },
    sqftPrice: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paymentMode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    queueNumber: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    operations: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    statusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'status',
        key: 'id'
      },
      actionID: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },

    paymentReceivableDate: {
      type: DataTypes.DATE,
      allowNull: true
    },

    bankAccountId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'bankinformationenum',
        key: 'id'
      }
    },

    medium: {
      type: DataTypes.ENUM,
      values : [
        'market_Place',
        'Peer_To_Peer',
        'DAO'
      ],
      defaultValue : 'DAO'

    },
    internalStatus: {
      type: DataTypes.ENUM,
      values: [
        'pending',
        'verified',
        'approved',
        'locked',
        'discard'
      ],
      defaultValue: 'pending'
    },
    transactionConfirmationTime: {
      type: DataTypes.DATE,
      allowNull: false
    }

  }, {
    sequelize,
    tableName: 'tradeactivity',
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
        name: "agentID",
        using: "BTREE",
        fields: [
          { name: "agentID" },
        ]
      },
      {
        name: "sellerID",
        using: "BTREE",
        fields: [
          { name: "sellerID" },
        ]
      },
      {
        name: "buyerID",
        using: "BTREE",
        fields: [
          { name: "buyerID" },
        ]
      },
      {
        name: "roundID",
        using: "BTREE",
        fields: [
          { name: "roundID" },
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
};
