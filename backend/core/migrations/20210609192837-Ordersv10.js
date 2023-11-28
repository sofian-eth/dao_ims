'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'transactionId', {
      allowNull: false,
      type: Sequelize.INTEGER
    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
