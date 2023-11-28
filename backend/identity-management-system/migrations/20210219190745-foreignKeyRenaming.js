"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn(
        "accountactivity",
        "subjectType",
        "subjectID"
      );
      await queryInterface.renameColumn(
        "property",
        "propertyStatus",
        "statusID"
      );
      await queryInterface.renameColumn(
        "usersession",
        "sessionID",
        "sessionKey"
      );

      await queryInterface.renameColumn(
        "tradeactivity",
        "status",
        "statusID"
      );


      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.renameColumn(
        "accountactivity",
        "subjectID",
        "subjectType"
      );
      await queryInterface.renameColumn(
        "property",
        "statusID",
        "propertyStatus"
      );
      await queryInterface.renameColumn(
        "usersession",
        "sessionKey",
        "sessionID"
      );

      await queryInterface.renameColumn(
        "tradeactivity",
        "statusID",
        "status"
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
