'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'scoreEnums',
      'description',
      {
        type: Sequelize.STRING,
       
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("scoreEnums", "description");
  }
};
