const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rolePermissions', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    roleID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id'
      }
    },
    permissionID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'permissions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'rolePermissions',
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
        name: "roleID",
        using: "BTREE",
        fields: [
          { name: "roleID" },
        ]
      },
      {
        name: "permissionID",
        using: "BTREE",
        fields: [
          { name: "permissionID" },
        ]
      },
    ]
  });
};
