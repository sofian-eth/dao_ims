'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('demarcatedAreaUnitAttachments', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      areaUnitID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'demarcatedAreaUnits',
          key: 'id'
        }
      },
      mediaID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'media',
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
    return queryInterface.dropTable('demarcatedAreaUnitAttachments');
  }
};
