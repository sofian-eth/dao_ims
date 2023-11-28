'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   

    await queryInterface.changeColumn('propertymilestones', 'mediaId', {
      type: Sequelize.INTEGER,
      references: {
        model: "media",
        key: "id"
      },
    });


  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.changeColumn('propertymilestones', 'mediaId', {
      type: Sequelize.INTEGER     
    });

  }
};
