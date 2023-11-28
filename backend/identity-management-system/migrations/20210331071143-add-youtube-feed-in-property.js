'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'property',
      'youtubeFeed',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:null 
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'property',
      'youtubeFeed',
      {
        type: Sequelize.STRING,
        allowNull: true,

      }
    )
  }
};
