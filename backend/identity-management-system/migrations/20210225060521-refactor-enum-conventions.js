'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.renameTable(
    //   "statusEnum",
    //   "statusenum"
    // );

    // await queryInterface.renameTable(
    //   "tagEnum",
    //   "tagenum"
    // );

    // await queryInterface.renameTable(
    //   "taxEnum",
    //   "taxenum"
    // );

    // await queryInterface.renameTable(
    //   "paymentModeEnum",
    //   "paymentmodeenum"
    // );

    // await queryInterface.renameTable(
    //   "GoalEnum",
    //   "goalenum"
    // );

    await queryInterface.renameTable(
      "userGoals",
      "usergoals"
    );
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.renameTable(
    //   "statusenum",
    //   "statusEnum"
    // );

    // await queryInterface.renameTable(
    //   "tagenum",
    //   "tagEnum"
    // );

    // await queryInterface.renameTable(
    //   "taxenum",
    //   "taxEnum"
    // );

    // await queryInterface.renameTable(
    //   "paymentmodeenum",
    //   "paymentModeEnum"
    // );

    // await queryInterface.renameTable(
    //   "goalenum",
    //   "GoalEnum"
    // );

    await queryInterface.renameTable(
      "usergoals",
      "userGoals"
    );
  }
};
