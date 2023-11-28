'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'tronAddress', {
      type: Sequelize.STRING, 
    });
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.dropColumn('users','tronAddress');
  }
};
