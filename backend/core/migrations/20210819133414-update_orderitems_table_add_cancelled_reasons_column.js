'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'orderItems',
      'cancelledReasons',
      {
        type: Sequelize.TEXT,
        allowNull: true,
        default: null,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'orderItems',
      'cancelledReasons',
    );
  }
};
