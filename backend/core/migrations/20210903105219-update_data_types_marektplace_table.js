'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('orders', 'sqftPrice', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'areaToSell', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'minimumLotSize', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'subTotal', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'total', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'tokenAmount', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'areaToList', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'salesTax', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orders', 'pricePerSqFt', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderItems', 'areaPurchased', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderItems', 'subTotal', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderItems', 'tax', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderItems', 'serviceCharges', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderItems', 'Total', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderItems', 'tokenAmount', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderItems', 'pricePerSqFt', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      }),
      queryInterface.changeColumn('orderPayments', 'amount', {
        type: Sequelize.DOUBLE,
        default: 0,
        allowNull: false,  
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
