'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderItems', 'tradeActivityID', {
      type: Sequelize.INTEGER,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderItems', 'tradeActivityID');
  }
};
