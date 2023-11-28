'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'nickName', {
      type: Sequelize.INTEGER,

    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'nickName');
  }
};
