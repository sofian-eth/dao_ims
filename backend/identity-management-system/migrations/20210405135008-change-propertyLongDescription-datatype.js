'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'property',
      'longDescription',
      {
        type: Sequelize.TEXT,
        allowNull: true,
        
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'property',
      'longDescription',
      {
        type: Sequelize.STRING,
        allowNull: true,
        
      }
    );
  }
};
