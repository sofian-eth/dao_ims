'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property','type',{
      type: Sequelize.ENUM,
      values : [
        'apartments',
        'complex',
        'commercial'
      ],
      defaultValue: 'apartments'
   
    })

    await queryInterface.addColumn('property','category',{
      type: Sequelize.ENUM,
      values : [
        'development',
        'mature',
       
      ],
      defaultValue: 'development'
   
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropColumn('property','type');
    await queryInterface.dropColumn('property','category');
  }
};
