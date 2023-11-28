'use strict';

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
   await queryInterface.bulkInsert('users',
   [
     {
       id:1,
       firstName: 'Haseeb',
       middleName: '',
       lastName: 'zia',
       email:'haseebzia@gmail.com',
       phoneNumber:'03225301775',
       is_phonenumber_verified:1,
       is_email_verified:1,
       smsID:'42342342',
       source:'42342342',
       googleID:'42342342',
       facebookID:'42342342',
       roleID:1,
       createdAt: new Date(),
       updatedAt: new Date()
     }
   ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
