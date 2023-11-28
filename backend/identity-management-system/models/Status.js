const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('statusEnum', {
    // id: {
    //   autoIncrement: true,
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true
    // },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "name"
    }
  }, {
    sequelize,
    tableName: 'statusenum',
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
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
    ]
  });
};
