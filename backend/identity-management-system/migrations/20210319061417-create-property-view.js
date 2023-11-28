'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propertyViews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      viewId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },

      },

      propertyId: {
        type: Sequelize.INTEGER,
        references: {
          model: "property",
          key: "id",
        },
      },

      isInterested: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('propertyViews');
  }
};