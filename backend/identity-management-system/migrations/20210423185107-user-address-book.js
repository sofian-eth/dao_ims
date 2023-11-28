'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('userAddressBook', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      addressLine1: {
        type: Sequelize.STRING,
      },
      addressLine2: {
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
      city: {
        type: Sequelize.STRING,
      },

      country: {
        type: Sequelize.STRING,
      },

      isShipping: {
        type: Sequelize.BOOLEAN,
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
