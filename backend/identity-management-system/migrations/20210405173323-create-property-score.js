'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('propertyScores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      scoreID: {
        type: Sequelize.INTEGER,
        references: {
          model: "scoreEnums",
          key: "id",
        },

      },

      propertyID: {
        type: Sequelize.INTEGER,
        references: {
          model: "property",
          key: "id",
        },
      },
     
      percentage: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('propertyScores');
  }
};