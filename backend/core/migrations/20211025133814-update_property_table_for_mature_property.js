'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('property', 'rentPerUnit', {
          type: Sequelize.DOUBLE,
          allowNull: true,
          comment: 'Per Month'
        }, { transaction: t }),
        queryInterface.addColumn('property', 'rentDisbursementDuration', {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'In Month'
        }, { transaction: t }),
        queryInterface.changeColumn('property', 'rentalDisbursementDay', {
          type: Sequelize.INTEGER,
          allowNull: true
        }, { transaction: t }),
        queryInterface.addColumn('property', 'operationStartAt', {
          type: Sequelize.DATE,
          allowNull: true
        }, { transaction: t })
      ])
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.changeColumn('property', 'rentPerUnit', {
          type: Sequelize.INTEGER,
          allowNull: false,
        }, { transaction: t }),
        queryInterface.removeColumn('property', 'rentDisbursementDuration', { transaction: t }),
        queryInterface.changeColumn('property', 'rentalDisbursementDay', {
          type: Sequelize.STRING,
          allowNull: true,
        }, { transaction: t }),
        queryInterface.removeColumn('property', 'operationStartAt', { transaction: t })
      ])
    });
  }
};
