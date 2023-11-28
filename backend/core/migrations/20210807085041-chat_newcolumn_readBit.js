'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('chat', 'readBit', {
      type: Sequelize.BOOLEAN,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('chat', 'readBit');
  }
};
