'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('userBankInformation', 'deleted', {
      type: Sequelize.BOOLEAN,
      default: false,
     
    })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('userBankInformation','deleted');
  }
};
