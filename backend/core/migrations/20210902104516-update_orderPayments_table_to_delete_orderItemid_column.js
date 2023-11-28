'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('orderPayments','orderItemID');
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orderPayments','orderItemID',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'orderItems',
        key: 'id'
      }
    });
  }
};
