'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameColumn('userReviews', 'userID', 'reviewedBy',
          { transaction: t }
        ),
        queryInterface.addColumn('userReviews', 'reviewedTo', 
          {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id'
            }
          },
          { transaction: t }
        )
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameColumn('userReviews', 'reviewedBy', 'userID', { transaction: t }),
        queryInterface.removeColumn('userReviews', 'reviewedTo', { transaction: t }),
      ])
    })
  }
};
