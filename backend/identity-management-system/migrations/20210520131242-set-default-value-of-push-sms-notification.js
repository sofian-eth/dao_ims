'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'users',
      'pushNotification',
      {
        type: Sequelize.BOOLEAN,
        default: true,
       
      }
    );

    await queryInterface.addColumn(
      'users',
      'smsNotification',
      {
        type: Sequelize.BOOLEAN,
        default: true,
       
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users','pushNotification');


    await queryInterface.removeColum('users','pushNotification');

  }
};
