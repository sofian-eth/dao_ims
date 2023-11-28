'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userReviews','source',
    {
      type: Sequelize.ENUM,
      values: [
        'MARKETPLACE_DEAL',
      ],
      defaultValue: 'MARKETPLACE_DEAL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('userReviews','source');
  }
};
