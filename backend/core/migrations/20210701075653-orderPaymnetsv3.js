'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderPayments', 'paidDate', {
      type: Sequelize.DATE,

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderPayments', 'paidDate');
  }
};
