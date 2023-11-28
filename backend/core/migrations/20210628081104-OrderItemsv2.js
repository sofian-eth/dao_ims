'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('orderItems','timeExtensionRequired',{
      type: Sequelize.INTEGER,
      
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('orderItems','timeExtensionRequired');
  }
};
