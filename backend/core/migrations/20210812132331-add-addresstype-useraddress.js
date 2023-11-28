'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('userAddressBook', 'addressType', {
      type: Sequelize.ENUM,
      default: 'Home',
      values : [
        'Home',
        'Office',
        'Other'
      ],
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('userAddressBook','addressType');
  }
};
