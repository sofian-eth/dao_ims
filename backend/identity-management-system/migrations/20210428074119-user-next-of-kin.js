'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userNextOfKin', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cnic: {
        type: Sequelize.STRING,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },

      smsNotification: {
        type: Sequelize.INTEGER,
      },

      pushNotification: {
        type: Sequelize.INTEGER,
      },

    
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });


  

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('userNextOfKin');
  }
};
