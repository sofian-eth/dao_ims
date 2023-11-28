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
      "paymentmodeenum",
      [
        {
          paymentMode: "Bank transfer/Online transfer/Wire transfer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          paymentMode: "Cash",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          paymentMode: "Cross cheque/Pay order",
          createdAt: new Date(),
          updatedAt: new Date(),
        },


        {
          paymentMode: "Adjustment",
          createdAt: new Date(),
          updatedAt: new Date(),
        },

        {
          paymentMode: "Gift",
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

    await queryInterface.bulkDelete('paymentmodeenum', null, {});
  },
};
