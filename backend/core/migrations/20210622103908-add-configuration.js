'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property','config',{
      type: Sequelize.JSON,
      defaultValue: '{ "serviceCharges": { "fixed": 20, "percentage": 2 }, "AreaSellLimit": { "days": 20, "roundsGap": 2 } }'
   
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('property','config');
  }
};
