'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderPayments', 'paymentMethod', {
      type: Sequelize.INTEGER,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderPayments', 'paymentMethod');
  }
};
