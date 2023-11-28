'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('property', 'baseMarketplaceRate', {
      type: Sequelize.DOUBLE,
      allowNull: true,
      comment: 'Per SqFt'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('property', 'baseMarketplaceRate');
  }
};
