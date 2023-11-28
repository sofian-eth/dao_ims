'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('notificationCenter', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title:{
        allowNull:true,
        type:Sequelize.STRING,
      },
      description:{
        allowNull:false,
        type:Sequelize.STRING,
      },
      redirectLink:{
        allowNull:true,
        type:Sequelize.STRING,
      },
      from:{
        allowNull:true,
        type:Sequelize.INTEGER,
      },
      fromName:{
        allowNull:true,
        type:Sequelize.STRING,
      },
      to:{
        allowNull:true,
        type:Sequelize.INTEGER,
      },
      readBit:{
        allowNull:true,
        type:Sequelize.BOOLEAN,
        default:0
      },
      type:{
        allowNull:true,
        type:Sequelize.STRING,
      },
      logo:{
        allowNull:true,
        type:Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      isDeleted:{
        allowNull:true,
        type:Sequelize.BOOLEAN,
        default:0
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notificationCenter'); 
  }
};
