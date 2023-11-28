'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property','propertyLogo',{
      type: Sequelize.STRING
    })
  },

  down: async (queryInterface, Sequelize) => {
  await queryInterface.removeColumn('property','propertyLogo');
  }
};
