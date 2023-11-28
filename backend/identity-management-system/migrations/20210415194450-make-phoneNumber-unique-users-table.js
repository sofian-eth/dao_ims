'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'phoneNumber', {
      type: Sequelize.STRING,
      unique: true
     
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('users', 'phoneNumber', {
      type: Sequelize.STRING     
    });
  }
};
