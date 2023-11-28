'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('orderItems', 'showBankAccountsBit', {
      type: Sequelize.BOOLEAN,
      default: false,
      allowNull: false,      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderItems', 'showBankAccountsBit');
  }
};
