'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('portfoliobalance', 'balance', {
      type: Sequelize.DECIMAL(10,4),
      
     
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('portfoliobalance', 'balance', {
      type: Sequelize.INTEGER     
    });
  }
};
