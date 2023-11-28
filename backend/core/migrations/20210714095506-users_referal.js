'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'refferalCode', {
      type: Sequelize.DOUBLE,
      default: 0,
    });
    await queryInterface.addColumn('users', 'refferedBy', {
      type: Sequelize.DOUBLE,
      default: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
