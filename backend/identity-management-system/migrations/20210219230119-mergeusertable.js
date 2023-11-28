'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.renameTable(
      "paymentEnum",
      "paymentModeEnum"
    );

      await queryInterface.addColumn(
        'users',
        'dateOfBirth',
        {
          type: Sequelize.DATE,
          allowNull: true,           
        }
      );

      await queryInterface.addColumn(
        'users',
        'billingAddress',
        {
          type: Sequelize.STRING,
          allowNull: true,
         
        }
      );

      await queryInterface.addColumn(
        'users',
        'shippingAddress',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );

      await queryInterface.addColumn(
        'users',
        'city',
        {
          type: Sequelize.STRING,
          allowNull: true,         
        }
      );

      await queryInterface.addColumn(
        'users',
        'country',
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      );

      await queryInterface.addColumn(
        'users',
        'province',
        {
          type: Sequelize.STRING,
          allowNull: true
          
        }
      );

      await queryInterface.addColumn(
        'users',
        'iskycApproved',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue:0 
        }
      );

      await queryInterface.addColumn(
        'users',
        'statusID',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'statusEnum',
            key: 'id'
          }
        }
      );

      await queryInterface.addColumn(
        'users',
        'paymentModeID',
        {
          type: Sequelize.INTEGER,
          allowNull: true,         
          references: {
            model: 'paymentModeEnum',
            key: 'id',
            
          }
        }
      );

      await queryInterface.addColumn(
        'users',
        'legalName',
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      );

      await queryInterface.addColumn(
        'users',
        'identityCardNumber',
        {
          type: Sequelize.STRING,
          allowNull: true
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

    
    await queryInterface.removeColumn('users', 'dateOfBirth');
    await queryInterface.removeColumn('users', 'billingAddress');
    await queryInterface.removeColumn('users', 'shippingAddress');
    await queryInterface.removeColumn('users', 'city');
    await queryInterface.removeColumn('users', 'country');
    await queryInterface.removeColumn('users', 'province');
    await queryInterface.removeColumn('users', 'iskycApproved');
    await queryInterface.removeColumn('users', 'statusID');
    await queryInterface.removeColumn('users', 'paymentModeID');
    await queryInterface.removeColumn('users', 'legalName');
    await queryInterface.removeColumn('users', 'identityCardNumber');
    
    await queryInterface.renameTable(
      "paymentModeEnum",
      "paymentEnum"
    );


  }
};
