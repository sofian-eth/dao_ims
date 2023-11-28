'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderPaymentMethods', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      orderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
      BankaccountID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'userBankInformation',
          key: 'id'
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orderPaymentMethods');
  }
};
