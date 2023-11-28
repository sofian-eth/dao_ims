'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userReviews','userID',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('userReviews','userID');
  }
};
