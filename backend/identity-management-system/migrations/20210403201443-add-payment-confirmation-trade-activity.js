'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tradeactivity',
      'paymentReceivableDate',
      {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue:null 
      }
    );


    await queryInterface.addColumn(
      'tradeactivity',
      'bankAccountId',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: 
        { 
          model: 'bankinformationenum', 
          key: 'id' 
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'tradeactivity',
      'paymentReceivableDate'
    );

    await queryInterface.removeColumn(
      'tradeactivity',
      'bankAccountId'
    );
  }
};
