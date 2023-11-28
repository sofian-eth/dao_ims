'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('goalenum',
      [
        {
          name: 'I want to gain good returns on my investment',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'I want to own a space for apartment or living',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'I need a reliable monthly income',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    
    await queryInterface.bulkDelete('goalenum', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
