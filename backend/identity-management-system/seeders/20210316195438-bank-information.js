'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('bankinformationenum',
    [
      {
      
        bankName: 'JS Bank',
        accountTitle: 'Element Residencia LLP',
        accountNumber: '000154347277272',
        IBAN:'PK470001217217271727172',
        branch:'Bahria Phase 7 Islamabad',
        propertyID:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
      
        bankName: 'Habib Metro',
        accountTitle: 'Element Residencia LLP',
        accountNumber: '000154347277272',
        IBAN:'PK470001217217271727172',
        branch:'Bahria Phase 7 Islamabad',
        propertyID:1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
      
        bankName: 'Habib Metro',
        accountTitle: 'Urban Dwelling',
        accountNumber: '000154347277272',
        IBAN:'PK470001217217271727172',
        branch:'Bahria Phase 7 Islamabad',
        propertyID:2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      {
      
        bankName: 'Habib Metro',
        accountTitle: 'Urban Dwelling',
        accountNumber: '000154347277272',
        IBAN:'PK470001217217271727172',
        branch:'Bahria Phase 7 Islamabad',
        propertyID:2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
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
