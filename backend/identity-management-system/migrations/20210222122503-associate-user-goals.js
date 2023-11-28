'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    

    return queryInterface.createTable(
      'userGoals',
      {       
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        goalId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
    
    return queryInterface.dropTable('userGoals');
  }
};
