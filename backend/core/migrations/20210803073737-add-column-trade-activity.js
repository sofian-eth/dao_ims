'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tradeactivity', 'isDemo', {
      type: Sequelize.BOOLEAN,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tradeactivity', 'isDemo');
  }
};

