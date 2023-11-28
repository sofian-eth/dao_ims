'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.addColumn("property", "philosophyTitle", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("property", "philosophyDescription", {
      type: Sequelize.STRING,
      allowNull: true
    });

  },

  down: async (queryInterface, Sequelize) => {
   

    await queryInterface.removeColumn(
      'property',
      'philosophyTitle'
    );

    await queryInterface.removeColumn(
      'property',
      'philosophyDescription'
    );

  }
};
