'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "propertyselectionmatrixenum",
      "itemID",
      "areaMatrixID"
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn(
      "accountactivity",
      "areaMatrixID",
      "itemID"
    );
  }
};
