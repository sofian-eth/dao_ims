'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'areaAvailableForMarketplace', {
      type: Sequelize.INTEGER,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'areaAvailableForMarketplace');
  }
};
