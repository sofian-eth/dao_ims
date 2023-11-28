'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "taxenum",
      [
        {
          taxDescription: "Sales Tax (per sqft)",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          taxDescription: "Processing Fees",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

      
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('taxenum', null, {});
  }
};
