'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('propertyStakeholders', 'website', {
      type: Sequelize.STRING,
      allowNull: true,
      
    });
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.dropColumn('propertyStakeholders','website');
  }
};
