'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    
    
    await queryInterface.addColumn(
      'property',
      'longDescription',
      {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue:null 
      }
    );
   
    await queryInterface.addColumn(
      'property',
      'daoScore',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null 
      }
    );

 
    await queryInterface.addColumn(
      'property',
      'reviewCount',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'property',
      'rating',
      {
        type: Sequelize.FLOAT(11,1),
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'property',
      'locationPoints',
      {
        type: Sequelize.GEOMETRY('POINT'),
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'property',
      'ownerID',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null,
        references: {
          model: 'users',
          key: 'id'
        }
      }
    );
    
  },

  down: async (queryInterface, Sequelize) => {
        
    await queryInterface.removeColumn('property','longDescription');
    await queryInterface.removeColumn('property','daoScore');
    await queryInterface.removeColumn('property','reviewCount');
    await queryInterface.removeColumn('property','rating');
    await queryInterface.removeColumn('property','locationPoints');
    await queryInterface.removeColumn('property','ownerID');
  }
};
