'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.addColumn('tradeactivity','transactionConfirmationTime',{
     type: Sequelize.DATE
   })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropColumn('tradeactivity','transactionConfirmationTime');

  }
};
