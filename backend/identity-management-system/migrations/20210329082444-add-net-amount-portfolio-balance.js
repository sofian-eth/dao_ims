'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'portfoliobalance',
      'netInvestment',
      {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true,
        defaultValue:null 
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('portfoliobalance','netInvestment');
  }
};
