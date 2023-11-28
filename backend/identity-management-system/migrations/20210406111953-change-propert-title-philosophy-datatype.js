'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'property',
      'philosophyDescription',
      {
        type: Sequelize.TEXT,
        allowNull: true,
        
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      'property',
      'philosophyDescription',
      {
        type: Sequelize.STRING,
        allowNull: true,
        
      }
    );
  }
};
