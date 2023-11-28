'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.renameColumn('orders', 'Total', 'total');
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
