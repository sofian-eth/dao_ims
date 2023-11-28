'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'allowedModules', {
      type: Sequelize.JSON,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropColumn('users','allowedModules');
  }
};
