'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderItems', 'extendedDays', {
      type: Sequelize.INTEGER,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderItems', 'extendedDays');
  }
};
