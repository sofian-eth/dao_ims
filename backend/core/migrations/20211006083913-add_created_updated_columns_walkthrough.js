'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('walkthrough', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false    
    });
    await queryInterface.addColumn('walkthrough', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false    
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('walkthrough', 'createdAt');
    await queryInterface.removeColumn('walkthrough', 'updatedAt');
  }
};
