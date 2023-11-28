'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'disputes',
      'userId',
      {
        type: Sequelize.INTEGER,
        allowNull: false,
      }
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'disputes',
      'userId',
    );
  }
};
