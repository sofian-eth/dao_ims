'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('demarcatedAreaTypes', 'propertyType', {
      type: Sequelize.ENUM,
      values: ['COMMERCIAL','RESIDENTIAL'],
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('demarcatedAreaTypes', 'propertyType');
  }
};
