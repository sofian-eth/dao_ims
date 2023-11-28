'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('property', 'maxRentPerUnit', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          comment: 'Per Month'
        }, { transaction: t }),
        queryInterface.addColumn('property', 'maxRentCreditsPerUnit', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          comment: 'Per Month'
        }, { transaction: t }),
        queryInterface.removeColumn('property', 'occupancyStatusPercentage', { transaction: t })
      ])
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('property', 'maxRentPerUnit', { transaction: t }),
        queryInterface.removeColumn('property', 'maxRentCreditsPerUnit', { transaction: t }),
        queryInterface.addColumn('property', 'occupancyStatusPercentage', {
          type: Sequelize.INTEGER,
          allowNull: false,
        }, { transaction: t }),
      ])
    });
  }
};
