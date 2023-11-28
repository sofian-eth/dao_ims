'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('demarcatedAreaUnits', 'category', 'spaceType');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('demarcatedAreaUnits', 'spaceType', 'category');
  }
};
