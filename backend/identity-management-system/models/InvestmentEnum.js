'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class investmentEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      investmentEnum.belongsToMany(models.users, {through: 'userInvestment'})
    }
  };
  investmentEnum.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    icon: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'investmentEnum',
    tableName: 'investmentenum'
  });
  return investmentEnum;
};