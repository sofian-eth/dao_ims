'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   await queryInterface.createTable('modules',{
     id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },

      moduleName: {
        type: Sequelize.STRING,
        allowNull: true,
        },

      showOnModule: {
        type: Sequelize.BOOLEAN,
        default: false,
        allowNull: false,
        },
   })
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.dropTable('modules');
  }
};
