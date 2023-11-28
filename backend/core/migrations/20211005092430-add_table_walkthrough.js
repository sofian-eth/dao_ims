'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.createTable('walkthrough',{
     id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      moduleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'modules',
          key: 'id'
        }
      },
      introSkipCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0, 
      }
   })
  },

  down: async (queryInterface, Sequelize) => {
   return queryInterface.dropTable('walkthrough');
  }
};
