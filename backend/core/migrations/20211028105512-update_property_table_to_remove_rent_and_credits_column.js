'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('property', 'rentCreditsPerUnit', { transaction: t }),
        queryInterface.removeColumn('property', 'rentPerUnit', { transaction: t })
      ])
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('property', 'rentCreditsPerUnit', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          comment: 'Per Month'
        }, { transaction: t }),
        queryInterface.addColumn('property', 'rentPerUnit', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          comment: 'Per Month'
        }, { transaction: t }),
      ])
    });
  }
};
