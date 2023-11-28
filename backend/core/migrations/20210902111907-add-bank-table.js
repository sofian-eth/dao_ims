'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('banks', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
       
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      svg: {
        type: Sequelize.STRING,
        allowNull: false
      },
      '2x': {
        type: Sequelize.STRING,
        allowNull: false
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },

      isDeleted: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: 0
      }


    });
  },

  down: async (queryInterface, Sequelize) => {
   await queryInterface.dropTable('banks');
  }
};
