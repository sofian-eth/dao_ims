'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.addColumn(
      'property',
      'salesAgreementLink',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'property',
      'termsLink',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:null 
      }
    );

 

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'property',
      'salesAgreementLink'
    );

    await queryInterface.removeColumn(
      'property',
      'termsLink'
    );

 

  }
};
