'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('demarcatedAreaUnits', 'category', {
      type: Sequelize.ENUM,
      values: ['ONE_BED_APARTMENT','TWO_BED_APARTMENT','TWO_ONE_BED_APARTMENT','THREE_BED_APARTMENT'],
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('demarcatedAreaUnits', 'category');
  }
};
