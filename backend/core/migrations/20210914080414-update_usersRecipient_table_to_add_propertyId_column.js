'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('usersRecipient','propertyId',
    {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'property',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('usersRecipient','propertyId');
  }
};
