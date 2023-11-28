'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propertyRisks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      propertyID: {
        type: Sequelize.INTEGER,
        references: {
          model: "property",
          key: "id",
        },
      },
      riskID: {
        type: Sequelize.INTEGER,
        references: {
          model: "riskEnums",
          key: "id",
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('propertyRisks');
  }
};