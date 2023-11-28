'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "cnicFrontID", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn("users", "cnicBackID", {
      type: Sequelize.INTEGER,
      allowNull: true,
     
    });

    await queryInterface.addColumn("users", "passportID", {
      type: Sequelize.INTEGER,
      allowNull: true,
  
    });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'users',
      'cnicFrontID'
    );

    await queryInterface.removeColumn(
      'users',
      'cnicBackID'
    );

    await queryInterface.removeColumn(
      'users',
      'passportID'
    );

  }
};
