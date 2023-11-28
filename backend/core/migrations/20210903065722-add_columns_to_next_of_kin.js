'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('userNextOfKin','profile',
     {
       type: Sequelize.STRING,
       allowNull: true,
       default:"" 
     },
     { transaction })
     await queryInterface.addColumn('userNextOfKin','portfolioBalance',
     {
       type: Sequelize.FLOAT,
       allowNull: true,
       default:"" 
     },
     { transaction })
     await queryInterface.addColumn('userNextOfKin','email',
     {
       type: Sequelize.STRING,
       allowNull: true,
       default:"" 
     },
     { transaction })
     await transaction.commit();
     return Promise.resolve();
   } catch (err) {
     if (transaction) {
       await transaction.rollback();
     }
     return Promise.reject(err);
   }
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("userNextOfKin", "profile", { transaction });
      await queryInterface.removeColumn("userNextOfKin", "portfolioBalance", { transaction });
      await queryInterface.removeColumn("userNextOfKin", "email", { transaction });

      await transaction.commit();
      return Promise.resolve();
    } catch (err) {
      if (transaction) {
        await transaction.rollback();
      }
      return Promise.reject(err);
    }
  }
};
