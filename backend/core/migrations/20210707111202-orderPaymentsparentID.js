'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderPayments', 'parentID', {
      type: Sequelize.INTEGER,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderPayments', 'parentID');
  }
};
