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
      "statusenum",
      [
        {
          name: "complete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "pending",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "locked",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "incomplete",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "needs more info",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "open",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "closed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "Active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "Upcoming",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "Done",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "discard",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "pledge confirmed",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "document verified",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          name: "confirmed",
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


    await queryInterface.bulkDelete('statusenum', null, {});
  },
};
