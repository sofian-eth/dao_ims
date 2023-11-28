'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.createTable('orderViews',
     {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      userId:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      orderId:{
        type:Sequelize.INTEGER,
        allowNull:false
      },
      ip:{
        type:Sequelize.STRING,
        allowNull:true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
      
    },
    {
      uniqueKeys: {
        unique_tag: {
          customIndex: true,
          fields: ["userId","orderId"]
        }
      }
    }
    )
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('orderViews');
     */
     await queryInterface.dropTable('orderViews');
  }
};
