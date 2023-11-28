'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderItems','cancelledBy',
    {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }),
    await queryInterface.addColumn('orderItems','cancelledAt',
    {
      type: Sequelize.DATE,
      allowNull: true,
    });
    return;
  },

  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('orderItems','cancelledBy'),
      await queryInterface.removeColumn('orderItems','cancelledAt')
    return;
  }
};
