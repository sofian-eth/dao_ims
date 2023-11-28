'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'userNextOfKin',
      'address',
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('userNextOfKin','address');
  }
};
