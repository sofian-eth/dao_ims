'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propertyselectionmatrixenum', {
     
      propertyID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      itemID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      areaUnits: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('propertyselectionmatrixenum');
  }
};