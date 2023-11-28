'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("tradeactivity", "actionID", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'actionenum',
        key: 'id'
      }
     
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'tradeactivity',
      'actionID'
    );
  }
};
