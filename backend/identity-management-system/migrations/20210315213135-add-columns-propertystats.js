'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'propertystats',
      'minArea',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'propertystats',
      'maxArea',
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue:null 
      }
    );

    await queryInterface.addColumn(
      'propertystats',
      'completionArea',
      {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:null 
      }
    );


  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'propertystats',
      'minArea'
    );

    await queryInterface.removeColumn(
      'propertystats',
      'maxArea'
    );

    await queryInterface.removeColumn(
      'propertystats',
      'completionArea'
    );

  }
};
