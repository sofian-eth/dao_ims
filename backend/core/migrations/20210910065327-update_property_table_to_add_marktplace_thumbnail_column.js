'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('property','marketplaceThumbnail',
    {
      type:Sequelize.STRING,
      allowNull:true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('property','marketplaceThumbnail');
  }
};
