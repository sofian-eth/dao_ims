'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'voucherExpireDate', {
      type: Sequelize.DATE,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'voucherExpireDate');
  }
};
