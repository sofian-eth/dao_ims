'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.renameTable('property_rents_history', 'propertyRentsHistory');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.renameTable('propertyRentsHistory', 'property_rents_history');
  }
};
