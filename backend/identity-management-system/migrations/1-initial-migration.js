'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "documents", deps: []
 * createTable "lov", deps: []
 * createTable "paymentmode", deps: []
 * createTable "permissions", deps: []
 * createTable "phonelookup", deps: []
 * createTable "roles", deps: []
 * createTable "status", deps: []
 * createTable "tags", deps: []
 * createTable "taxestype", deps: []
 * createTable "property", deps: [status]
 * createTable "propertypricehistory", deps: [property]
 * createTable "propertydocuments", deps: [documents, property]
 * createTable "propertygallery", deps: [property]
 * createTable "developmentrounds", deps: [property, status]
 * createTable "users", deps: [roles]
 * createTable "propertystats", deps: [property]
 * createTable "propertytaxes", deps: [taxestype, property]
 * createTable "propertyupdates", deps: [property]
 * createTable "propertyupdatestag", deps: [tags, propertyupdates]
 * createTable "rolePermissions", deps: [roles, permissions]
 * createTable "marketplaceorders", deps: [users, status]
 * createTable "propertymilestones", deps: [developmentrounds]
 * createTable "accountactivity", deps: [users, lov]
 * createTable "bidders", deps: [marketplaceorders, users]
 * createTable "portfoliobalance", deps: [users, property]
 * createTable "tradeactivity", deps: [users, users, users, developmentrounds, property, status]
 * createTable "tradedocuments", deps: [tradeactivity, documents]
 * createTable "userInformations", deps: [users, status, paymentmode]
 * createTable "usersession", deps: [users]
 * addIndex "subjectType" to table "accountactivity"
 * addIndex "propertyID" to table "propertypricehistory"
 * addIndex "propertyID" to table "developmentrounds"
 * addIndex "propertyID" to table "propertystats"
 * addIndex "name" to table "permissions"
 * addIndex "userID" to table "accountactivity"
 * addIndex "propertyID" to table "propertytaxes"
 * addIndex "statusID" to table "developmentrounds"
 * addIndex "propertyID" to table "propertyupdates"
 * addIndex "userID" to table "usersession"
 * addIndex "tagID" to table "propertyupdatestag"
 * addIndex "updateID" to table "propertyupdatestag"
 * addIndex "propertyID" to table "portfoliobalance"
 * addIndex "roleID" to table "rolePermissions"
 * addIndex "permissionID" to table "rolePermissions"
 * addIndex "orderID" to table "bidders"
 * addIndex "name" to table "roles"
 * addIndex "propertyStatus" to table "property"
 * addIndex "name" to table "status"
 * addIndex "buyerID" to table "bidders"
 * addIndex "documentID" to table "propertydocuments"
 * addIndex "propertyID" to table "propertydocuments"
 * addIndex "agentID" to table "tradeactivity"
 * addIndex "sellerID" to table "tradeactivity"
 * addIndex "buyerID" to table "tradeactivity"
 * addIndex "roundID" to table "tradeactivity"
 * addIndex "propertyID" to table "tradeactivity"
 * addIndex "status" to table "tradeactivity"
 * addIndex "sellerID" to table "marketplaceorders"
 * addIndex "tradeID" to table "tradedocuments"
 * addIndex "documentID" to table "tradedocuments"
 * addIndex "propertyID" to table "propertygallery"
 * addIndex "userID" to table "userInformations"
 * addIndex "statusID" to table "userInformations"
 * addIndex "paymentMode" to table "userInformations"
 * addIndex "statusID" to table "marketplaceorders"
 * addIndex "email" to table "users"
 * addIndex "roleID" to table "users"
 * addIndex "roundID" to table "propertymilestones"
 * addIndex "taxID" to table "propertytaxes"
 *
 **/

var info = {
    "revision": 1,
    "name": "initial-migration",
    "created": "2021-02-12T23:38:34.934Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "documents",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "documentName": {
                    "type": Sequelize.STRING(255),
                    "field": "documentName",
                    "allowNull": false
                },
                "documentUrl": {
                    "type": Sequelize.STRING(255),
                    "field": "documentUrl",
                    "allowNull": true
                },
                "documentType": {
                    "type": Sequelize.STRING(255),
                    "field": "documentType",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "lov",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(255),
                    "field": "name",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "paymentmode",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "paymentMode": {
                    "type": Sequelize.STRING(255),
                    "field": "paymentMode",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "permissions",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(255),
                    "field": "name",
                    "unique": "name",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "phonelookup",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "phoneNumber": {
                    "type": Sequelize.STRING(255),
                    "field": "phoneNumber",
                    "allowNull": true
                },
                "smsID": {
                    "type": Sequelize.STRING(255),
                    "field": "smsID",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "roles",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(255),
                    "field": "name",
                    "unique": "name",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "status",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(255),
                    "field": "name",
                    "unique": "name",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "tags",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "tagName": {
                    "type": Sequelize.STRING(255),
                    "field": "tagName",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "taxestype",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "taxDescription": {
                    "type": Sequelize.STRING(255),
                    "field": "taxDescription",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "property",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "name": {
                    "type": Sequelize.STRING(255),
                    "field": "name",
                    "allowNull": false
                },
                "description": {
                    "type": Sequelize.TEXT,
                    "field": "description",
                    "allowNull": true
                },
                "location": {
                    "type": Sequelize.STRING(255),
                    "field": "location",
                    "allowNull": true
                },
                "totalSqft": {
                    "type": Sequelize.INTEGER,
                    "field": "totalSqft",
                    "allowNull": true
                },
                "coverPhoto": {
                    "type": Sequelize.STRING(255),
                    "field": "coverPhoto",
                    "allowNull": true
                },
                "propertyStatus": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyStatus",
                    "references": {
                        "model": "status",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "circulationArea": {
                    "type": Sequelize.INTEGER,
                    "field": "circulationArea",
                    "allowNull": true
                },
                "propertySymbol": {
                    "type": Sequelize.STRING(255),
                    "field": "propertySymbol",
                    "allowNull": true
                },
                "blockchainMainContract": {
                    "type": Sequelize.STRING(255),
                    "field": "blockchainMainContract",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertypricehistory",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "propertyValue": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyValue",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertydocuments",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "documentID": {
                    "type": Sequelize.INTEGER,
                    "field": "documentID",
                    "references": {
                        "model": "documents",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "documentType": {
                    "type": Sequelize.STRING(255),
                    "field": "documentType",
                    "allowNull": true
                },
                "title": {
                    "type": Sequelize.STRING(255),
                    "field": "title",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertygallery",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "imageURL": {
                    "type": Sequelize.STRING(255),
                    "field": "imageURL",
                    "allowNull": false
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "developmentrounds",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "statusID": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "field": "statusID",
                    "references": {
                        "model": "status",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "roundName": {
                    "type": Sequelize.STRING(255),
                    "field": "roundName",
                    "allowNull": true
                },
                "roundDetails": {
                    "type": Sequelize.STRING(255),
                    "field": "roundDetails",
                    "allowNull": true
                },
                "startDate": {
                    "type": Sequelize.DATE,
                    "field": "startDate",
                    "allowNull": true
                },
                "endDate": {
                    "type": Sequelize.DATE,
                    "field": "endDate",
                    "allowNull": true
                },
                "funds": {
                    "type": Sequelize.INTEGER,
                    "field": "funds",
                    "allowNull": true
                },
                "pricePerSqft": {
                    "type": Sequelize.INTEGER,
                    "field": "pricePerSqft",
                    "allowNull": true
                },
                "lockFundsTx": {
                    "type": Sequelize.STRING(255),
                    "field": "lockFundsTx",
                    "allowNull": true
                },
                "unlockFundsTx": {
                    "type": Sequelize.STRING(255),
                    "field": "unlockFundsTx",
                    "allowNull": true
                },
                "discounts": {
                    "type": Sequelize.STRING(255),
                    "field": "discounts",
                    "allowNull": true
                },
                "marketPrice": {
                    "type": Sequelize.INTEGER,
                    "field": "marketPrice",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "users",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "firstName": {
                    "type": Sequelize.STRING(255),
                    "field": "firstName",
                    "allowNull": true
                },
                "middleName": {
                    "type": Sequelize.STRING(255),
                    "field": "middleName",
                    "allowNull": true
                },
                "lastName": {
                    "type": Sequelize.STRING(255),
                    "field": "lastName",
                    "allowNull": true
                },
                "email": {
                    "type": Sequelize.STRING(255),
                    "field": "email",
                    "unique": "email",
                    "allowNull": true
                },
                "phoneNumber": {
                    "type": Sequelize.STRING(255),
                    "field": "phoneNumber",
                    "allowNull": true
                },
                "is_phonenumber_verified": {
                    "type": Sequelize.TINYINT,
                    "field": "is_phonenumber_verified",
                    "allowNull": true
                },
                "is_email_verified": {
                    "type": Sequelize.TINYINT,
                    "field": "is_email_verified",
                    "allowNull": true
                },
                "smsID": {
                    "type": Sequelize.STRING(255),
                    "field": "smsID",
                    "allowNull": true
                },
                "source": {
                    "type": Sequelize.STRING(255),
                    "field": "source",
                    "allowNull": true
                },
                "googleID": {
                    "type": Sequelize.STRING(255),
                    "field": "googleID",
                    "allowNull": true
                },
                "facebookID": {
                    "type": Sequelize.STRING(255),
                    "field": "facebookID",
                    "allowNull": true
                },
                "roleID": {
                    "type": Sequelize.INTEGER,
                    "field": "roleID",
                    "references": {
                        "model": "roles",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "password": {
                    "type": Sequelize.STRING(255),
                    "field": "password",
                    "allowNull": true
                },
                "emailVerificationToken": {
                    "type": Sequelize.STRING(255),
                    "field": "emailVerificationToken",
                    "allowNull": true
                },
                "passwordResetToken": {
                    "type": Sequelize.STRING(255),
                    "field": "passwordResetToken",
                    "allowNull": true
                },
                "walletAddress": {
                    "type": Sequelize.STRING(255),
                    "field": "walletAddress",
                    "allowNull": true
                },
                "membershipNumber": {
                    "type": Sequelize.STRING(255),
                    "field": "membershipNumber",
                    "allowNull": true
                },
                "passwordChangeRequire": {
                    "type": Sequelize.TINYINT,
                    "field": "passwordChangeRequire",
                    "defaultValue": 0,
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertystats",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "rentalYield": {
                    "type": Sequelize.STRING(255),
                    "field": "rentalYield",
                    "allowNull": true
                },
                "ROR": {
                    "type": Sequelize.STRING(255),
                    "field": "ROR",
                    "allowNull": true
                },
                "equityMultiple": {
                    "type": Sequelize.STRING(255),
                    "field": "equityMultiple",
                    "allowNull": true
                },
                "assetLiquidation": {
                    "type": Sequelize.STRING(255),
                    "field": "assetLiquidation",
                    "allowNull": true
                },
                "capitalGrowth": {
                    "type": Sequelize.STRING(255),
                    "field": "capitalGrowth",
                    "allowNull": true
                },
                "netRentalReturn": {
                    "type": Sequelize.STRING(255),
                    "field": "netRentalReturn",
                    "allowNull": true
                },
                "investmentPeriod": {
                    "type": Sequelize.STRING(255),
                    "field": "investmentPeriod",
                    "allowNull": true
                },
                "estimatedIRR": {
                    "type": Sequelize.STRING(255),
                    "field": "estimatedIRR",
                    "allowNull": true
                },
                "minInvestment": {
                    "type": Sequelize.STRING(255),
                    "field": "minInvestment",
                    "allowNull": true
                },
                "fundingRounds": {
                    "type": Sequelize.INTEGER,
                    "field": "fundingRounds",
                    "allowNull": true
                },
                "expectedgrowthrate": {
                    "type": Sequelize.STRING(255),
                    "field": "expectedgrowthrate",
                    "allowNull": true
                },
                "guaranteedgrowthrate": {
                    "type": Sequelize.STRING(255),
                    "field": "guaranteedgrowthrate",
                    "allowNull": true
                },
                "marketriskgrowthrate": {
                    "type": Sequelize.STRING(255),
                    "field": "marketriskgrowthrate",
                    "allowNull": true
                },
                "expectedmaturitydate": {
                    "type": Sequelize.STRING(255),
                    "field": "expectedmaturitydate",
                    "allowNull": true
                },
                "propertytype": {
                    "type": Sequelize.STRING(255),
                    "field": "propertytype",
                    "allowNull": true
                },
                "discount": {
                    "type": Sequelize.STRING(255),
                    "field": "discount",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertytaxes",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "taxID": {
                    "type": Sequelize.INTEGER,
                    "field": "taxID",
                    "references": {
                        "model": "taxestype",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "price": {
                    "type": Sequelize.INTEGER,
                    "field": "price",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertyupdates",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "title": {
                    "type": Sequelize.STRING(255),
                    "field": "title",
                    "allowNull": false
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "description": {
                    "type": Sequelize.STRING(255),
                    "field": "description",
                    "allowNull": true
                },
                "url": {
                    "type": Sequelize.STRING(255),
                    "field": "url",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertyupdatestag",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "tagID": {
                    "type": Sequelize.INTEGER,
                    "field": "tagID",
                    "references": {
                        "model": "tags",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "updateID": {
                    "type": Sequelize.INTEGER,
                    "field": "updateID",
                    "references": {
                        "model": "propertyupdates",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "rolePermissions",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "roleID": {
                    "type": Sequelize.INTEGER,
                    "field": "roleID",
                    "references": {
                        "model": "roles",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "permissionID": {
                    "type": Sequelize.INTEGER,
                    "field": "permissionID",
                    "references": {
                        "model": "permissions",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "marketplaceorders",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "sellerID": {
                    "type": Sequelize.INTEGER,
                    "field": "sellerID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "areaUnits": {
                    "type": Sequelize.INTEGER,
                    "field": "areaUnits",
                    "allowNull": false
                },
                "sqftPrice": {
                    "type": Sequelize.INTEGER,
                    "field": "sqftPrice",
                    "allowNull": false
                },
                "totalCost": {
                    "type": Sequelize.INTEGER,
                    "field": "totalCost",
                    "allowNull": false
                },
                "statusID": {
                    "type": Sequelize.INTEGER,
                    "field": "statusID",
                    "references": {
                        "model": "status",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "propertymilestones",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "roundID": {
                    "type": Sequelize.INTEGER,
                    "field": "roundID",
                    "references": {
                        "model": "developmentrounds",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "title": {
                    "type": Sequelize.STRING(255),
                    "field": "title",
                    "allowNull": true
                },
                "description": {
                    "type": Sequelize.STRING(255),
                    "field": "description",
                    "allowNull": true
                },
                "completionProgress": {
                    "type": Sequelize.INTEGER,
                    "field": "completionProgress",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "accountactivity",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "userID": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "field": "userID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "subjectType": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "field": "subjectType",
                    "references": {
                        "model": "lov",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "action": {
                    "type": Sequelize.STRING(255),
                    "field": "action",
                    "allowNull": true
                },
                "userAgent": {
                    "type": Sequelize.STRING(255),
                    "field": "userAgent",
                    "allowNull": true
                },
                "IPAddress": {
                    "type": Sequelize.STRING(255),
                    "field": "IPAddress",
                    "allowNull": true
                },
                "browser": {
                    "type": Sequelize.STRING(255),
                    "field": "browser",
                    "allowNull": true
                },
                "operatingSystem": {
                    "type": Sequelize.STRING(255),
                    "field": "operatingSystem",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "bidders",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "orderID": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "field": "orderID",
                    "references": {
                        "model": "marketplaceorders",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "buyerID": {
                    "type": Sequelize.INTEGER,
                    "onUpdate": "CASCADE",
                    "onDelete": "NO ACTION",
                    "field": "buyerID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "sqftPrice": {
                    "type": Sequelize.INTEGER,
                    "field": "sqftPrice",
                    "allowNull": false
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "portfoliobalance",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "userID": {
                    "type": Sequelize.INTEGER,
                    "field": "userID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "balance": {
                    "type": Sequelize.INTEGER,
                    "field": "balance",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "tradeactivity",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "agentID": {
                    "type": Sequelize.INTEGER,
                    "field": "agentID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "sellerID": {
                    "type": Sequelize.INTEGER,
                    "field": "sellerID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "buyerID": {
                    "type": Sequelize.INTEGER,
                    "field": "buyerID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "roundID": {
                    "type": Sequelize.INTEGER,
                    "field": "roundID",
                    "references": {
                        "model": "developmentrounds",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "blockchainReference": {
                    "type": Sequelize.STRING(255),
                    "field": "blockchainReference",
                    "allowNull": true
                },
                "billingAddress": {
                    "type": Sequelize.STRING(255),
                    "field": "billingAddress",
                    "allowNull": true
                },
                "areaPledged": {
                    "type": Sequelize.DECIMAL(20, 4),
                    "field": "areaPledged",
                    "allowNull": true
                },
                "totalPrice": {
                    "type": Sequelize.DECIMAL(20, 4),
                    "field": "totalPrice",
                    "allowNull": true
                },
                "propertyID": {
                    "type": Sequelize.INTEGER,
                    "field": "propertyID",
                    "references": {
                        "model": "property",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "sqftPrice": {
                    "type": Sequelize.INTEGER,
                    "field": "sqftPrice",
                    "allowNull": true
                },
                "paymentMode": {
                    "type": Sequelize.STRING(255),
                    "field": "paymentMode",
                    "allowNull": true
                },
                "queueNumber": {
                    "type": Sequelize.INTEGER,
                    "field": "queueNumber",
                    "allowNull": true
                },
                "paymentDate": {
                    "type": Sequelize.DATE,
                    "field": "paymentDate",
                    "allowNull": true
                },
                "operations": {
                    "type": Sequelize.STRING(255),
                    "field": "operations",
                    "allowNull": true
                },
                "status": {
                    "type": Sequelize.INTEGER,
                    "field": "status",
                    "references": {
                        "model": "status",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "tradedocuments",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "tradeID": {
                    "type": Sequelize.INTEGER,
                    "field": "tradeID",
                    "references": {
                        "model": "tradeactivity",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "documentID": {
                    "type": Sequelize.INTEGER,
                    "field": "documentID",
                    "references": {
                        "model": "documents",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "userInformations",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "dateOfBirth": {
                    "type": Sequelize.STRING(255),
                    "field": "dateOfBirth",
                    "allowNull": true
                },
                "billingAddress": {
                    "type": Sequelize.STRING(255),
                    "field": "billingAddress",
                    "allowNull": true
                },
                "shippingAddress": {
                    "type": Sequelize.STRING(255),
                    "field": "shippingAddress",
                    "allowNull": true
                },
                "city": {
                    "type": Sequelize.STRING(255),
                    "field": "city",
                    "allowNull": true
                },
                "country": {
                    "type": Sequelize.STRING(255),
                    "field": "country",
                    "allowNull": true
                },
                "province": {
                    "type": Sequelize.STRING(255),
                    "field": "province",
                    "allowNull": true
                },
                "is_kyc_approved": {
                    "type": Sequelize.TINYINT,
                    "field": "is_kyc_approved",
                    "allowNull": true
                },
                "userID": {
                    "type": Sequelize.INTEGER,
                    "field": "userID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "statusID": {
                    "type": Sequelize.INTEGER,
                    "field": "statusID",
                    "references": {
                        "model": "status",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "paymentMode": {
                    "type": Sequelize.INTEGER,
                    "field": "paymentMode",
                    "references": {
                        "model": "paymentmode",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "legalName": {
                    "type": Sequelize.STRING(255),
                    "field": "legalName",
                    "allowNull": true
                },
                "identityCardNumber": {
                    "type": Sequelize.STRING(255),
                    "field": "identityCardNumber",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "usersession",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "allowNull": false,
                    "autoIncrement": true
                },
                "userID": {
                    "type": Sequelize.INTEGER,
                    "field": "userID",
                    "references": {
                        "model": "users",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "sessionID": {
                    "type": Sequelize.STRING(255),
                    "field": "sessionID",
                    "allowNull": true
                },
                "createdAt": {
                    "type": Sequelize.DATE,
                    "field": "createdAt",
                    "allowNull": false
                },
                "updatedAt": {
                    "type": Sequelize.DATE,
                    "field": "updatedAt",
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "addIndex",
        params: [
            "accountactivity",
            [{
                "name": "subjectType"
            }],
            {
                "indexName": "subjectType"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertypricehistory",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "developmentrounds",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertystats",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "permissions",
            [{
                "name": "name"
            }],
            {
                "indexName": "name",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "accountactivity",
            [{
                "name": "userID"
            }],
            {
                "indexName": "userID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertytaxes",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "developmentrounds",
            [{
                "name": "statusID"
            }],
            {
                "indexName": "statusID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertyupdates",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "usersession",
            [{
                "name": "userID"
            }],
            {
                "indexName": "userID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertyupdatestag",
            [{
                "name": "tagID"
            }],
            {
                "indexName": "tagID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertyupdatestag",
            [{
                "name": "updateID"
            }],
            {
                "indexName": "updateID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "portfoliobalance",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "rolePermissions",
            [{
                "name": "roleID"
            }],
            {
                "indexName": "roleID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "rolePermissions",
            [{
                "name": "permissionID"
            }],
            {
                "indexName": "permissionID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "bidders",
            [{
                "name": "orderID"
            }],
            {
                "indexName": "orderID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "roles",
            [{
                "name": "name"
            }],
            {
                "indexName": "name",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "property",
            [{
                "name": "propertyStatus"
            }],
            {
                "indexName": "propertyStatus"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "status",
            [{
                "name": "name"
            }],
            {
                "indexName": "name",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "bidders",
            [{
                "name": "buyerID"
            }],
            {
                "indexName": "buyerID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertydocuments",
            [{
                "name": "documentID"
            }],
            {
                "indexName": "documentID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertydocuments",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradeactivity",
            [{
                "name": "agentID"
            }],
            {
                "indexName": "agentID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradeactivity",
            [{
                "name": "sellerID"
            }],
            {
                "indexName": "sellerID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradeactivity",
            [{
                "name": "buyerID"
            }],
            {
                "indexName": "buyerID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradeactivity",
            [{
                "name": "roundID"
            }],
            {
                "indexName": "roundID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradeactivity",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradeactivity",
            [{
                "name": "status"
            }],
            {
                "indexName": "status"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "marketplaceorders",
            [{
                "name": "sellerID"
            }],
            {
                "indexName": "sellerID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradedocuments",
            [{
                "name": "tradeID"
            }],
            {
                "indexName": "tradeID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "tradedocuments",
            [{
                "name": "documentID"
            }],
            {
                "indexName": "documentID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertygallery",
            [{
                "name": "propertyID"
            }],
            {
                "indexName": "propertyID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "userInformations",
            [{
                "name": "userID"
            }],
            {
                "indexName": "userID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "userInformations",
            [{
                "name": "statusID"
            }],
            {
                "indexName": "statusID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "userInformations",
            [{
                "name": "paymentMode"
            }],
            {
                "indexName": "paymentMode"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "marketplaceorders",
            [{
                "name": "statusID"
            }],
            {
                "indexName": "statusID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "users",
            [{
                "name": "email"
            }],
            {
                "indexName": "email",
                "indicesType": "UNIQUE"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "users",
            [{
                "name": "roleID"
            }],
            {
                "indexName": "roleID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertymilestones",
            [{
                "name": "roundID"
            }],
            {
                "indexName": "roundID"
            }
        ]
    },
    {
        fn: "addIndex",
        params: [
            "propertytaxes",
            [{
                "name": "taxID"
            }],
            {
                "indexName": "taxID"
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
