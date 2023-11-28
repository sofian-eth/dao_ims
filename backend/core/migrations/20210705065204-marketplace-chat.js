'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('chat',{
     id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
     },
     senderId: {
       type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
     },

     receiverId: {
       type: Sequelize.INTEGER,
       allowNull: false,
       references: {
         model: 'users',
         key: 'id'
       },
     },
       orderItemId: {
         type: Sequelize.INTEGER,
         allowNull: false,
         references: {
           model: 'orderItems',
           key: 'id'
         }
       },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
       createdAt: {
         type: Sequelize.DATE,
         allowNull: false,

       },

       updatedAt: {
         type: Sequelize.DATE,
         allowNull: false,
       }
     
   })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.dropTable('chat');
  }
};
