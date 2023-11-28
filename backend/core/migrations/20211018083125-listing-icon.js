'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property', 'listingIcon', {
      type: Sequelize.STRING,
      allowNull: true    
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropColumn('property','listingIcon');
  }
};
