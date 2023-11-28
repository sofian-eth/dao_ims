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
      pricePerSqFt: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      areaToSell: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      minimumLotSize: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      subTotal: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      Total: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      daysToAcceptPayment: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      tokenAmount: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      serviceChargesMethod: {
        type: Sequelize.STRING,
        allowNull: false
      },
      areaToList: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      salesTax: {
        type: Sequelize.INTEGER,
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
