'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.addColumn(
      'propertygallery',
      'videoID',
      {
        type: Sequelize.STRING,
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.removeColumn(
      'propertygallery',
      'videoID'
    );

  }
};
