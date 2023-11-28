'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('property', 'rentLockingDay', {
          type: Sequelize.INTEGER,
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('property', 'worthIncrementPercentage', {
          type: Sequelize.DOUBLE,
          allowNull: false,
          comment: 'Per Year'
        }, { transaction: t }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('property', 'rentLockingDay', { transaction: t }),
        queryInterface.removeColumn('property', 'worthIncrementPercentage', { transaction: t })
      ]);
    });
  }
};
