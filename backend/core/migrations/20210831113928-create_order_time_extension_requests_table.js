'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('orderTimeExtensionRequests', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      orderItemID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orderItems',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.ENUM,
        values: [
          'REQUESTED',
          'ACCEPTED',
          'REJECTED'
        ],
        defaultValue: 'REQUESTED'
      },
      acceptedAt : {
        type: Sequelize.DATE,
        allowNull: true
      },
      rejectedAt : {
        type: Sequelize.DATE,
        allowNull: true
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
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orderTimeExtensionRequests'); 
  }
};
