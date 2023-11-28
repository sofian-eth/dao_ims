'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.changeColumn('propertymilestones', 'mediaId', {
      type: Sequelize.INTEGER,
    
    });
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.changeColumn('propertymilestones', 'mediaId', {
      type: Sequelize.STRING,
    });

  }
};
