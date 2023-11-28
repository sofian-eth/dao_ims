'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'tradeactivity',
      'medium',
      {
        type: Sequelize.ENUM,
        values : [
          'market_Place',
          'Peer_To_Peer',
          'DAO'
        ],
        defaultValue : 'DAO'
       
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterace.dropColumn('tradeactivity','medium')
  }
};
