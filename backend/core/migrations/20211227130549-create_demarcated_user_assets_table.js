'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('demarcatedUserAssets', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      areaUnitID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'demarcatedAreaUnits',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: ['WATCHED', 'RESERVED','BOOKED', 'ASSIGNED', 'DISCARDED', 'TRANSFERED'],
        allowNull: true,
      },
      tradeActivityID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'tradeactivity',
          key: 'id'
        }
      },
      conversionAreaSnapshot: {
        type: Sequelize.JSON,
        allowNull: true,
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
    return queryInterface.dropTable('demarcatedUserAssets');
  }
};
