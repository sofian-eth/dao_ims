'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orderItems', 'showBankAccounts', {
      type: Sequelize.STRING,
      default: '',
      allowNull: true,  
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('orderItems', 'showBankAccounts', {
      type: Sequelize.INTEGER,
      default: 0
    });
  }
};
