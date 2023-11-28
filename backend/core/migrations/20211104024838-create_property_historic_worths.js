'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('propertyHistoricWorths', {
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
      year: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: '2021, 2022, 2023 etc'
      },
      pricePerUnit: {
        type: Sequelize.DOUBLE,
        allowNull: false,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('propertyHistoricWorths');
  }
};
