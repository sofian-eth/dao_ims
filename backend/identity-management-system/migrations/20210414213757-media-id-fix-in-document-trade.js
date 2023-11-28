'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn(
      'tradedocuments',
      'mediaId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: "media",
          key: "id"
      },
      }
    );


    await queryInterface.addColumn(
      'propertydocuments',
      'mediaId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: "media",
          key: "id"
      },
      }
    );


  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.removeColumn("tradedocuments", "mediaId");
    await queryInterface.removeColumn('propertydocuments','mediaId');
  }
};
