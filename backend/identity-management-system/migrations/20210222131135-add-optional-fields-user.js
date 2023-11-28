'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.addColumn(
      'users',
      'isOnlineTransactionEnabled',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'users',
      'initialInvestmentBudget',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null 
      }
    );


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
