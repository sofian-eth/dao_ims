'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('demarcatedAreaUnits', 'coding');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('demarcatedAreaUnits', 'coding', {
      type: Sequelize.STRING,
      allowNull: true
    });
  }
};
