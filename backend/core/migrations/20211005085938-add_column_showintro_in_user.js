'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'showIntro', {
      type: Sequelize.BOOLEAN,
      default: false,
      allowNull: false,      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'showIntro');
  }
};
