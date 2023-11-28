"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert(
      "tagenum",
      [
        {
          tagName: "finance",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          tagName: "commercial",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          tagName: "technology",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('tagenum', null, {});
  },
};
