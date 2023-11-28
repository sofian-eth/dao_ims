'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('propertyRoundPriceHistory', {
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
      roundID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'developmentrounds',
          key: 'id'
        }
      },

      currentPrice : {
        type: Sequelize.INTEGER,
        allowNull: false
      },

      updatedPrice : {
        type: Sequelize.INTEGER,
        allowNull: false
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
    return queryInterface.dropTable('propertyRoundPriceHistory');
  }
};
