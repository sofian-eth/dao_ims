'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('chat','mediaID',
    {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'media',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('chat','mediaID');
  }
};
