'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'orderItems',
      'sellerServiceChargesTradeActivityId',
      {
        type: Sequelize.INTEGER,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'orderItems',
      'sellerServiceChargesTradeActivityId',
    );
  }
};
