'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GoalEnum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {      
      GoalEnum.belongsToMany(models.users, {through: 'usergoals'})
    }
  };
  
  GoalEnum.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'goalenum',
    tableName: 'goalenum'
  });

  return GoalEnum;
};