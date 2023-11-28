'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('property', 'facebookLink', {
      type: Sequelize.STRING,
      allowNull: true,
      
    });

    await queryInterface.addColumn('property', 'instagramLink', {
      type: Sequelize.STRING,
      allowNull: true,
     
    });

    await queryInterface.addColumn('property', 'linkedinLink', {
      type: Sequelize.STRING,
      allowNull: true,
     
    });
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.removeColumn('property','facebookLink');
   await queryInterface.removeColumn('property','instagramLink');
   await queryInterface.removeColumn('property','linkedinLink');
   
  }
};
