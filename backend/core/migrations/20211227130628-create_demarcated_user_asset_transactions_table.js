'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('demarcatedUserAssetTransactions', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userAssetID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'demarcatedUserAssets',
          key: 'id'
        }
      },
      area:{
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['PENDING', 'LOCKED','DISCARDED'],
        allowNull: false,
        defaultValue: 'PENDING'
      },
      tradeActivityID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tradeactivity',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('demarcatedUserAssetTransactions');
  }
};
