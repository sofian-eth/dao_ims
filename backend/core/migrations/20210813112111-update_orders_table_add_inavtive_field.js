'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'orders',
      'isActive',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: 1
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'orders',
      'isActive',
    );
  }
};
