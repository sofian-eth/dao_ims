'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'areaUnlockRequests',
      'reason',
      {
        type: Sequelize.TEXT,
        default: ''
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'areaUnlockRequests',
      'reason',
    );
  }
};
