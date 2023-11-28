'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('orders', {
      id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      sellerID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      propertyID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'property',
          key: 'id'
        }
      },    
      sqftPrice: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      areaToSell: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      minimumLotSize: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      subTotal: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      Total: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      maximumDaysToWaitForPayment: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tokenAmount: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      serviceChargesType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      areaToList: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      salesTax: {
        type: Sequelize.DOUBLE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('orders');
  }
};
