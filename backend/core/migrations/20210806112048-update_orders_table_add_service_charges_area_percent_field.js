'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'orders',
      'serviceChargesAreaPercent',
      {
        type: Sequelize.FLOAT,
        allowNull: false,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'orders',
      'serviceChargesAreaPercent',
    );
  }
};
