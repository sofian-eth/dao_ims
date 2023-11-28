'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('usersRecipient',{
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

      recipientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model : 'users',
          key: 'id'
        }
      }
   })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.dropTable('usersRecipient');
  }
};
