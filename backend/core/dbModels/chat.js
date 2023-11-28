module.exports = function(sequelize, DataTypes) {
  const chat = sequelize.define('chat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'orderItems',
          key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'users',
          key: 'id'
      }
    },
    orderItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'orderItems',
          key: 'id'
      }
    },
    message: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    readBit: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default: 0,
    },
    mediaId:{
      type: DataTypes.INTEGER,
      allowNull: true,
    },//changes
  }, {
    sequelize,
    tableName: 'chat',
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
        name: "senderId",
        using: "BTREE",
        fields: [
          { name: "senderId" },
        ]
      },
      {
        name: "receiverId",
        using: "BTREE",
        fields: [
          { name: "receiverId" },
        ]
      },
      {
        name: "orderItemId",
        using: "BTREE",
        fields: [
          { name: "orderItemId" },
        ]
      },
    ]
  });

  chat.associate = function (models) {
    //orderItems.belongsTo(models.userBankInformation)
  };

  return chat;
};
