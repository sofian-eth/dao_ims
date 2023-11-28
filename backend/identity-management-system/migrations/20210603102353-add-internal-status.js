'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tradeactivity',
      'internalStatus',
      {
        type: Sequelize.ENUM,
        values : [
          'pending',
          'verified',
          'approved',
          'locked',
          'discard'
        ],
        defaultValue: 'pending'
     
       
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tradeactivity','internalStatus');
  }
};
