'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('userReviews', 'rejectedAt', { transaction: t }),
        queryInterface.addColumn('userReviews', 'old_comment', {
          type:Sequelize.TEXT,
          allowNull:true    
        }, { transaction: t })
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('userReviews', 'rejectedAt', 
          {
            type: Sequelize.DATE,
            allowNull: true    
          },
          { transaction: t }
        ),
        queryInterface.removeColumn('userReviews', 'old_comment', { transaction: t }),
      ]);
    });
  }
};
