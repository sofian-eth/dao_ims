'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userArea','completedOrdersArea',
    {
      type: Sequelize.DOUBLE,
      allowNull: false,
      default: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('userArea','completedOrdersArea');
  }
};
