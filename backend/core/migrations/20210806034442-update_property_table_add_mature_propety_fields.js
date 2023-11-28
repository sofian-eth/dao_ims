'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        "property",
        "rentPerUnit",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "property",
        "rentIncrementPercentage",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "property",
        "incrementDuration",
        {
          type: Sequelize.ENUM("ANNUAL", "BI_ANNUAL"),
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "property",
        "rentalDisbursementDay",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        "property",
        "occupancyStatusPercentage",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction },
      );
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
    let transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn("property", "rentPerUnit", { transaction });
      await queryInterface.removeColumn("property", "rentIncrementPercentage", { transaction });
      await queryInterface.removeColumn("property", "incrementDuration", { transaction });
      await queryInterface.removeColumn("property", "rentalDisbursementDay", { transaction });
      await queryInterface.removeColumn("property", "occupancyStatusPercentage", { transaction });

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
