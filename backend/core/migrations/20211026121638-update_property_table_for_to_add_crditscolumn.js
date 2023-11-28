'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('property', 'rentCreditsPerUnit', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          comment: 'Per Month'
        }, { transaction: t }),
        queryInterface.changeColumn('property', 'rentIncrementPercentage', {
          type: Sequelize.DOUBLE,
          allowNull: true
        }, { transaction: t }),
        queryInterface.changeColumn('property', 'incrementDuration', {
          type: Sequelize.INTEGER,
          allowNull: true
        }, { transaction: t })
      ])
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('property', 'rentCreditsPerUnit', { transaction: t }),
        queryInterface.changeColumn('property', 'rentIncrementPercentage', {
          type: Sequelize.INTEGER,
          allowNull: false,
        }, { transaction: t }),
        queryInterface.changeColumn('property', 'incrementDuration', {
          type: Sequelize.ENUM("ANNUAL", "BI_ANNUAL"),
          allowNull: true,
        }, { transaction: t })
      ])
    });
  }
};
