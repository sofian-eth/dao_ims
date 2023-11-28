'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'propertymilestones',
      'estimatedDate',
      {
        type: Sequelize.DATE,
        allowNull: true,
       
      }
    );
    await queryInterface.addColumn(
      'propertymilestones',
      'completionDate',
      {
        type: Sequelize.DATE,
        allowNull: true,
       
      }
    );

    await queryInterface.addColumn(
      'propertymilestones',
      'status',
      {
        type: Sequelize.ENUM,
        values : [
          'scheduled',
          'inProgress',
          'completed'
        ]
       
      }
    );

     
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('propertymilestones','estimatedDate');
    await queryInterface.removeColumn('propertymilestones','completionDate');
    await queryInterface.removeColumn('propertymilestones','status');
    
    
  }
};
