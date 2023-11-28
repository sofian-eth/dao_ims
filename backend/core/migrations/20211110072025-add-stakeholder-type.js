'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property_propertyStakeholders', 'type', {
      type: Sequelize.ENUM,
      values: ['OWNER','SPONSER','OPERATOR','TRUSTEE'],
      
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropColumn('property_propertyStakeholders','type');
  }
};
