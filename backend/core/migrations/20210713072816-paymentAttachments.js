'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('paymentAttachments', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },     
      paymentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orderPayments',
          key: 'id'
        }
      },
      mediaID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'media',
          key: 'id'
        }
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('paymentAttachments');
  }
};
