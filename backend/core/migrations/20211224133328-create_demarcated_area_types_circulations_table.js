'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('demarcatedCirculations', {
      circulationApplicatorID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'demarcatedAreaTypes',
          key: 'id'
        }
      },
      circulationApplyOnID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'demarcatedAreaTypes',
          key: 'id'
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('demarcatedCirculations');
  }
};
