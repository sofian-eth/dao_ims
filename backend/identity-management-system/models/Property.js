const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const property = sequelize.define('property', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    totalSqft: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coverPhoto: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    statusID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'status',
        key: 'id'
      }
    },
    circulationArea: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    propertySymbol: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    blockchainMainContract: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    salesAgreementLink: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    termsLink: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    longDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    daoScore: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reviewCount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rating: {
      type: DataTypes.FLOAT(11,1),
      allowNull: true
    },
    locationPoints:{
      type: DataTypes.GEOMETRY('POINT'),
      allowNull:true,
    },
    youtubeFeed: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    philosophyTitle: {
      type: DataTypes.STRING,
      allowNull: true
    },
    philosophyDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },


    locationDescription: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    premiumFeatures: {
      type: DataTypes.TEXT,
      allowNull: true
    }
   
  }, {
    sequelize,
    tableName: 'property',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "statusID",
        using: "BTREE",
        fields: [
          { name: "statusID" },
        ]
      },
    ]
  });

  property.associate = function (models) {
    
    property.belongsTo(models.users, {foreignKey: 'ownerID'});
    property.belongsToMany(models.users, {through: 'propertyView'});
    property.belongsToMany(models.scoreEnum, {through: models.propertyScore});
    property.belongsToMany(models.riskEnum, {through: models.propertyRisk});


  };

  return property;
};
