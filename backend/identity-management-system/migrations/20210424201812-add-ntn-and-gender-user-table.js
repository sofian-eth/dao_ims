'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'ntn',
      {
        type: Sequelize.STRING,
      }
    );

    await queryInterface.addColumn(
      'users',
      'gender',
      {
        type: Sequelize.STRING,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users','ntn');
    await queryInterface.removeColumn('users','gender');

  }
};
