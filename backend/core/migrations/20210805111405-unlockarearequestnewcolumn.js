'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('areaUnlockRequests', 'approvedArea', {
      type: Sequelize.FLOAT,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('areaUnlockRequests', 'approvedArea');
  }
};
