'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users','cookiesAcceptedBit',
    {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users','cookiesAcceptedBit');
  }
};
