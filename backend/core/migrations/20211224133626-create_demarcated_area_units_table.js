'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('demarcatedAreaUnits', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      coding: {
        type: Sequelize.STRING,
        allowNull: true
      },
      // propertyID: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: 'property',
      //     key: 'id'
      //   }
      // },
      demarcatedAreaTypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'demarcatedAreaTypes',
          key: 'id'
        }
      },
      floorNumber: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      netArea: {
        type: Sequelize.DOUBLE,
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
    return queryInterface.dropTable('demarcatedAreaUnits');
  }
};
