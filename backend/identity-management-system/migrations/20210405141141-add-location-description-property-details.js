'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'property',
      'locationDescription',
      {
        type: Sequelize.TEXT,
        allowNull: true,
       
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'property',
      'locationDescription'
    )
  }
};
