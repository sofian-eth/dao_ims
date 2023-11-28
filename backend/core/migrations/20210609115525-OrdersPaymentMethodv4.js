'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderPaymentMethods', 'createdAt', {
      allowNull: false,
        type: Sequelize.DATE
    });

    await queryInterface.addColumn('orderPaymentMethods', 'updatedAt', {
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
