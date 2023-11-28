'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    await queryInterface.renameTable(
      "status",
      "statusEnum"
    );

    await queryInterface.renameTable(
      "tags",
      "tagEnum"
    );

    await queryInterface.renameTable(
      "taxestype",
      "taxEnum"
    );

    await queryInterface.renameTable(
      "paymentmode",
      "paymentEnum"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable(
      "statusEnum",
      "status"
    );

    await queryInterface.renameTable(
      "tagEnum",
      "tags"
    );

    await queryInterface.renameTable(
      "taxEnum",
      "taxestype"
    );

    await queryInterface.renameTable(
      "paymentEnum",
      "paymentmode"
    );
  }
};
