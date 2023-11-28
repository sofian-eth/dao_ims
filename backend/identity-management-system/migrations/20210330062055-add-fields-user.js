'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'minInvestmentBudget',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'users',
      'maxInvestmentBudget',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null 
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'minInvestmentBudget'
    );

    await queryInterface.removeColumn(
      'users',
      'maxInvestmentBudget'
    );
  }
};
