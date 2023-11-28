module.exports = function (sequelize, DataTypes) {
  const userBankInformation = sequelize.define('userBankInformation', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bankName: DataTypes.STRING,
    accountTitle: DataTypes.STRING,
    accountNumber: DataTypes.STRING,
    iban: DataTypes.STRING,
    branch: DataTypes.STRING,
    bankId:DataTypes.INTEGER,
    userID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'userBankInformation',
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
        name: "userID",
        using: "BTREE",
        fields: [
          { name: "userID" },
        ]
      },
    ]
  });

  userBankInformation.associate = function (models) { };

  return userBankInformation;
};