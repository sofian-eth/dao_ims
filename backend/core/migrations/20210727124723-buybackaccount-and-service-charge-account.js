'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property', 'buyBackAccountID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
      
    }); 

    await queryInterface.addColumn('property', 'serviceChargesAccountID', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
      
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('property','buyBackAccountID');
    await queryInterface.removeColumn('property','serviceChargesAccountID');
  }
};
