'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'isSuspend',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
       
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users','isSuspend');
  }
};
