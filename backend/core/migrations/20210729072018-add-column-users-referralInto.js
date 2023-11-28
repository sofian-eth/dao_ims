'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'showReferralIntro', {
      type: Sequelize.BOOLEAN,
      default: 0,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'showReferralIntro');
  }
};
