'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('userAddressBook', 'isDeleted', {
      type: Sequelize.BOOLEAN,
      default: false,
     
    })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('userAddressBook','isDeleted');
  }
};
