'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property','status',
    {
      type: Sequelize.ENUM,
      allowNull: true,
      default: 'Active',
      values: [
        "Active",
        "InActive"
      ]

    })

  },

  down: async (queryInterface, Sequelize) => {
 await queryInterface.removeColumn('property','status');
  }
};
