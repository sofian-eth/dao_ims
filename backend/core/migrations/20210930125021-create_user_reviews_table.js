'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('userReviews', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      comment: {
        type:Sequelize.TEXT,
        allowNull:true
      },
      rating: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        default: 0
      },
      orderItemsID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orderItems',
          key: 'id'
        }
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
    return queryInterface.dropTable('userReviews');
  }
};
