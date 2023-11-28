const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
  const user = sequelize.define(
    "users",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      middleName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: "email",
      },
      profilePicture: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      phoneNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      is_phonenumber_verified: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      pushNotification: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      smsNotification: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      is_email_verified: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      smsID: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cookiesAcceptedBit: {
        type : DataTypes.TINYINT,
        allowNull: true,
        default : null
    },
      source: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      googleID: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      facebookID: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      roleID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "roles",
          key: "id",
        },
      },
      
      password: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      emailVerificationToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      passwordResetToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      walletAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      membershipNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isBasicInfoAvailable: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },

      dateOfBirth: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      billingAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      shippingAddress: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      province: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      isSuperAdmin: {
        type: DataTypes.TINYINT,
        allowNull: true
      },
      isDAOSuperAdmin: {
        type: DataTypes.TINYINT,
        allowNull: true
      },
      isDAOMember: {
        type: DataTypes.TINYINT,
        allowNull: true
      },
      isGuest: {
        type: DataTypes.TINYINT,
        allowNull: true
      },
      adminHomePage:{
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      iskycApproved: {
        type: DataTypes.TINYINT,
        allowNull: true,
      },
      statusID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "status",
          key: "id",
        },
      },
      paymentModeID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "paymentmode",
          key: "id",
        },
      },
      legalName: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      identityCardNumber: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      initialInvestmentBudget: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      isOnlineTransactionEnabled: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: null,
      },

      isOptionalInformationAvailable: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: false,
      },


      cnicFrontID : {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "media",
          key: "id",
        },
      },

      cnicBackID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "media",
          key: "id",
        },
      },

      passportID: {
        type: DataTypes.INTEGER,
        allowNull: true
      
    },

    minInvestmentBudget: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    maxInvestmentBudget: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ntn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isSuspend: {
      type: DataTypes.TINYINT,
      allowNull: true
    },
    passportNo : {
      type: DataTypes.STRING,
      allowNull: true
    },
    refferalCode:{
      type:DataTypes.STRING,
      allowNull:true
    },
    refferedBy:{
      type:DataTypes.STRING,
      allowNull:true
    },
    campaignID:{
      type: DataTypes.TINYINT,
      allowNull:true
    },
    voucherExpireDate:{
      type:DataTypes.DATE,
      allowNull:true
    },
    showReferralIntro:{
      type:DataTypes.BOOLEAN,
      allowNull:true
    },
    nickName:{
      type:DataTypes.STRING,
      allowNull:true,
    },
    tronAddress: {
      type: DataTypes.STRING
    },
    isFiler:{
      type:DataTypes.BOOLEAN,
      allowNull:true,
      default:false
    },
    showIntro:{
      type:DataTypes.BOOLEAN,
      allowNull:false,
      default:true
    },
    device_token:{
      type:DataTypes.STRING,
      allowNull:false,
      default: ''
    },
    allowedModules:{
      type:DataTypes.JSON,
      allowNull:true
    },
    kycApprovedAt: {
      type:DataTypes.DATE,
      allowNull:true
    },
    isOfflineUser:{
      type:DataTypes.STRING,
      allowNull:true,
      default: '0',
      
    }
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "roleID", 
          using: "BTREE",
          fields: [{ name: "roleID" }],
        },
        {
          name: "statusID",
          using: "BTREE",
          fields: [{ name: "statusID" }],
        },
        {
          name: "paymentMode",
          using: "BTREE",
          fields: [{ name: "paymentModeID" }],
        },
      ],
    }
  );

  user.associate = function (models) {
    user.belongsToMany(models.investmentEnum, { through: "userInvestment" });
    user.belongsToMany(models.goalenum, { through: "usergoals" });
    user.hasMany(models.property, {as: 'Sellers', foreignKey: 'ownerID'});
    user.belongsToMany(models.property, {through: 'propertyView'});
  };

  return user;
};
