'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('demarcatedAreaTypes', 'isPremium', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('demarcatedAreaTypes', 'isPremium');
  }
};
