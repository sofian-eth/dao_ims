'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'developmentrounds',
      'displayStartDate',
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

    await queryInterface.addColumn(
      'developmentrounds',
      'displayEndDate',
      {
        type: Sequelize.DATE,
        allowNull: true,
      }
    );

  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('developmentrounds','displayStartDate');
   await queryInterface.removeColumn('developmentrounds','displayEndDate');
  }
};
