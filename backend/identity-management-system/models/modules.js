const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const modules = sequelize.define(
    "modules",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      moduleName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      moduleName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      showOnModule: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }
  );
  return modules;
};
