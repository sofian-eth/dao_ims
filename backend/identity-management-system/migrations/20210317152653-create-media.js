'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('media', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fileName: {
        type: Sequelize.STRING
      },
      originalFileName: {
        type: Sequelize.STRING
      },
      relativePath: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      isImage: {
        type: Sequelize.BOOLEAN
      },
      documentId: {
        type: Sequelize.INTEGER,
        references: {
          model: "documentEnum",
          key: "id",
        },

      },
      extension: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('media');
  }
};