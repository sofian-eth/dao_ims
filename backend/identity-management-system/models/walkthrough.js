const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const walkthrough = sequelize.define(
    "walkthrough",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      moduleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "modules",
          key: "id",
        },
      },
      introSkipCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default:0
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

//   walkthrough.associate = function (models) {
//     walkthrough.belongsToMany(models.users, { through: "id" });
//     walkthrough.belongsToMany(models.modules, { through: "id" });
//   };

  return walkthrough;
};
