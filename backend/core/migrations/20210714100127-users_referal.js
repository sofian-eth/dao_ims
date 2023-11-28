'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'campaignID', {
      type: Sequelize.INTEGER,
      default: 0
    })
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
