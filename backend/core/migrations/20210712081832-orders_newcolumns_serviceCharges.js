'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'serviceCharges', {
      type: Sequelize.DOUBLE,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orders', 'serviceCharges');
  }
};
