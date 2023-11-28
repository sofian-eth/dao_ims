const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('campaign', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false
          },
          status: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          startDate: {
            type: DataTypes.DATE,
            allowNull: false
          },
          endDate: {
            type: DataTypes.DATE,
            allowNull: false
          }
    },{
    sequelize,
    tableName: 'campaign',
    timestamps: true,
    })
}