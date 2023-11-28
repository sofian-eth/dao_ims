'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'profilePicture',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "media",
          key: "id",
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users','profilePicture');
  }
};
