'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("propertymilestones", "mediaId", {
      type: Sequelize.STRING(255),
      allowNull: true,
    
     
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'propertymilestones',
      'mediaId'
    );
  }
};
