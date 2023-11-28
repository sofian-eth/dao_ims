'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userBankInformation', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bankName: {
        type: Sequelize.STRING,
      },
      accountTitle: {
        type: Sequelize.STRING,
      },
      userID: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      accountNumber: {
        type: Sequelize.STRING,
      },

      iban: {
        type: Sequelize.STRING,
      },

      branch: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('userBankInformation');
  }
};
