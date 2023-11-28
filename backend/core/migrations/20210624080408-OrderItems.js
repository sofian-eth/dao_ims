'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orderItems', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      areaPurchased: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      subTotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      tax: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      serviceCharges: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      Total: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },    
      tokenAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      orderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders',
          key: 'id'
        }
      },
      buyerID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
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
    await queryInterface.dropTable('orderItems');
  }
};
