'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('property_rents_history', {
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
      rentPerSqFt: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      creditsPerSqFt: {
        type: Sequelize.FLOAT,
        allowNull: false
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
    return queryInterface.dropTable('property_rents_history');
  }
};
