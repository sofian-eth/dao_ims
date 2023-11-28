'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkInsert('scoreEnums',
    [
      {
        name: 'Business Perspective',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Territory',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Legal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Financial Updates',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Project Pricing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Financing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      

    ])


  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.bulkDelete('scoreEnums', null, {});

  }
};
