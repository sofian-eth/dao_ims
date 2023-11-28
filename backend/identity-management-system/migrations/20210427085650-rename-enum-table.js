'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable(
      "documentEnum",
      "documentenum"
    );

    await queryInterface.renameTable(
      "investmentEnum",
      "investmentenum"
    );

    await queryInterface.renameTable(
      "paymentModeEnum",
      "paymentmodeenum"
    );

    await queryInterface.renameTable(
      "taxEnum",
      "taxenum"
    );

    await queryInterface.renameTable(
      "tagEnum",
      "tagenum"
    );

    await queryInterface.renameTable(
      "statusEnum",
      "statusenum"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameTable(
      "documentenum",
      "documentEnum"
    );

    await queryInterface.renameTable(
      "investmentenum",
      "investmentEnum"
    );


    await queryInterface.renameTable(
      "paymentmodeenum",
      "paymentModeEnum"
    );

    await queryInterface.renameTable(
      "taxenum",
      "taxEnum"
    );

    await queryInterface.renameTable(
      "tagEnum",
      "tagenum"
    );

    await queryInterface.renameTable(
      "statusenum",
      "statusEnum"
    );

  }
};
