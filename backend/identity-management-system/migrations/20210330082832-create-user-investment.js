'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userInvestment', {

      userID: {
        type:Sequelize.INTEGER,
        primaryKey: true,
     
      },
      investmentID: {
        type:Sequelize.INTEGER,
        primaryKey: true,
      
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
    await queryInterface.dropTable('userInvestment');
  }
};