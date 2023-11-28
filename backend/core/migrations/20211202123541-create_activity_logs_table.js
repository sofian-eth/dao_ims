'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('activityLogs', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      logName: {
        type: Sequelize.STRING,
        defaultValue: 'default'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      subjectID: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      subjectType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      event: {
        type: Sequelize.STRING,
        allowNull: true
      },
      causerID: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      causerType: {
        type: Sequelize.STRING,
        allowNull: true
      },
      properties: {
        type: Sequelize.JSON,
        allowNull: true
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
    return queryInterface.dropTable('activityLogs');
  }
};
