'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orders','remainingAmount',{
      type: Sequelize.DOUBLE,
     
    })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('orders','remainingAmount');
  }
};
