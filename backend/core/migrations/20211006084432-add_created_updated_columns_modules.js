'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('modules', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false    
    });
    await queryInterface.addColumn('modules', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false    
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('modules', 'createdAt');
    await queryInterface.removeColumn('modules', 'updatedAt');
  }
};
