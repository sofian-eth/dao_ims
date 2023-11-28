'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders','completedAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('orders','completedAt');
  }
};
