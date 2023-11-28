'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('userNextOfKin','isDeleted',
    {
      type: Sequelize.DOUBLE,
      allowNull: false,
      default: 0
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('userNextOfKin','isDeleted');
  }
};
