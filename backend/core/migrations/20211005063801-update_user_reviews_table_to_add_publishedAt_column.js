'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userReviews','publishedAt',
      {
        type: Sequelize.DATE,
        allowNull: true,
      });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('userReviews','publishedAt');
  }
};
