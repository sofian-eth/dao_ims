'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders','revertOrderReason',
    {
      type:Sequelize.TEXT,
      allowNull:true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('orders','revertOrderReason');
  }
};
