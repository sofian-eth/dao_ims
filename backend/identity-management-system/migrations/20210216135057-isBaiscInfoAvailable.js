'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.addColumn(
      'users',
      'isBasicInfoAvailable',
      {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue:0 
      }
    );



    
    
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.removeColumn('users', 'isBasicInfoAvailable')
  }
};
