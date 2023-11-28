'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('propertyRentPayouts', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      propertyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'property',
          key: 'id'
        }
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      area: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      occupancyPercentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      rentPerUnit: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      creditsPerUnit: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      disbursedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        allowNull: true,
        values: [
          'PENDING',
          'RECEIVED'
        ],
        defaultValue: 'PENDING'
      },
      rentDisbursementDuration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '3 for QUARTER, 1 for MONTHLY etc'
      },
      rentDisbursementTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1st Quarter, 1st month etc'
      },
      rentDisbursementYear: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '1st Quarter of 2021, 1st month of 2021 etc'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP()')
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('propertyRentPayouts');
  }
};
