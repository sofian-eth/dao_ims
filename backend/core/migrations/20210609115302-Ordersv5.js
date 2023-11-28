'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders', 'createdAt', {
      allowNull: false,
      type: Sequelize.DATE
    });

    await queryInterface.addColumn('orders', 'updatedAt', {
      allowNull: false,
        type: Sequelize.DATE
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
