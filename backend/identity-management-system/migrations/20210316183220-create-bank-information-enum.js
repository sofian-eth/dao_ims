'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('bankinformationenum', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bankName: {
        type: Sequelize.STRING
      },
      accountTitle: {
        type: Sequelize.STRING
      },
      accountNumber: {
        type: Sequelize.STRING
      },
      IBAN: {
        type: Sequelize.STRING
      },
      branch: {
        type: Sequelize.STRING
      },
      propertyID: {
        type: Sequelize.INTEGER,
        references: 
        { 
          model: 'property', 
          key: 'id' 
        }
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
    await queryInterface.dropTable('bankinformationenum');
  }
};