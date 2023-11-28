'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('areaUnlockRequests','approvedAt',
    {
      type: Sequelize.DATE,
      allowNull: true,
    }),
    await queryInterface.addColumn('areaUnlockRequests','rejectedAt',
    {
      type: Sequelize.DATE,
      allowNull: true,
    });
    return;
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('areaUnlockRequests','approvedAt'),
      await queryInterface.removeColumn('areaUnlockRequests','rejectedAt')
    return;
  }
};
