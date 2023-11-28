'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userArea','ordersArea',
    {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('userArea','ordersArea');
  }
};
