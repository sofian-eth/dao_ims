'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

      await queryInterface.bulkInsert('documentenum',
      [
        {
          name: 'Profile Pic',
          bucketId: 'profilepic',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'CNIC Front',
          bucketId: 'cnicfront',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'CNIC Back',
          bucketId: 'cnicback',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Passport',
          bucketId: 'passport',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Terms and Conditions',
          bucketId: 'termsandconditions',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        {
          name: 'Deposit Slip',
          bucketId: 'depositslip',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Stamp Paper',
          bucketId: 'stamppaper',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        {
          name: 'Property Document',
          bucketId: 'propertydocument',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        {
          name: 'Milestone Images',
          bucketId: 'milestoneimages',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        {
          name: 'Property Gallery',
          bucketId: 'propertygallery',
          createdAt: new Date(),
          updatedAt: new Date()
        },





      ])

  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('documentenum', null, {});

  }
};
