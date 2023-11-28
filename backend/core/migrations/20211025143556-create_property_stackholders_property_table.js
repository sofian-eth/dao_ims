'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('property_propertyStakeholders', {
      propertyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'property',
          key: 'id'
        }
      },
      propertyStakeholderID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'propertyStakeholders',
          key: 'id'
        }
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('property_propertyStakeholders');
  }
};
