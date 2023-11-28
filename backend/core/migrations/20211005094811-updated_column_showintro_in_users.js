'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'showIntro', {
      type: Sequelize.BOOLEAN,
      default: true,
      allowNull: false,      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'showIntro');
  }
};
