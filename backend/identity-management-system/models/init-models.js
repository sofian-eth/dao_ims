var DataTypes = require("sequelize").DataTypes;
// var _SequelizeMeta = require("./SequelizeMeta");
var _accountactivity = require("./AccountActivity");
var _bidders = require("./Bidders");
var _developmentrounds = require("./DevelopmentRounds");
var _documents = require("./Documents");
var _lov = require("./Lov");
var _marketplaceorders = require("./MarketplaceOrders");
var _paymentmode = require("./PaymentMode");
var _permissions = require("./Permissions");
var _phonelookup = require("./phonelookup");
var _portfoliobalance = require("./PortfolioBalance");
var _property = require("./Property");
var _propertydocuments = require("./PropertyDocuments");
var _propertygallery = require("./PropertyGallery");
var _propertymilestones = require("./PropertyMilestones");
var _propertypricehistory = require("./PropertyPriceHistory");
var _propertystats = require("./PropertyStats");
var _propertytaxes = require("./propertytaxes");
var _propertyupdates = require("./propertyupdates");
var _propertyupdatestag = require("./PropertyUpdatesTag");
var _rolePermissions = require("./rolePermissions");
var _roles = require("./Roles");
var _status = require("./Status");
var _tags = require("./Tags");
var _taxestype = require("./taxestype");
var _tradeactivity = require("./TradeActivity");
var _tradedocuments = require("./TradeDocuments");
var _userInformations = require("./userInformations");
var _users = require("./Users");
var _usersession = require("./Usersession");

function initModels(sequelize) {
  // var SequelizeMeta = _SequelizeMeta(sequelize, DataTypes);
  var accountactivity = _accountactivity(sequelize, DataTypes);
  var bidders = _bidders(sequelize, DataTypes);
  var developmentrounds = _developmentrounds(sequelize, DataTypes);
  var documents = _documents(sequelize, DataTypes);
  var lov = _lov(sequelize, DataTypes);
  var marketplaceorders = _marketplaceorders(sequelize, DataTypes);
  var paymentmode = _paymentmode(sequelize, DataTypes);
  var permissions = _permissions(sequelize, DataTypes);
  var phonelookup = _phonelookup(sequelize, DataTypes);
  var portfoliobalance = _portfoliobalance(sequelize, DataTypes);
  var property = _property(sequelize, DataTypes);
  var propertydocuments = _propertydocuments(sequelize, DataTypes);
  var propertygallery = _propertygallery(sequelize, DataTypes);
  var propertymilestones = _propertymilestones(sequelize, DataTypes);
  var propertypricehistory = _propertypricehistory(sequelize, DataTypes);
  var propertystats = _propertystats(sequelize, DataTypes);
  var propertytaxes = _propertytaxes(sequelize, DataTypes);
  var propertyupdates = _propertyupdates(sequelize, DataTypes);
  var propertyupdatestag = _propertyupdatestag(sequelize, DataTypes);
  var rolePermissions = _rolePermissions(sequelize, DataTypes);
  var roles = _roles(sequelize, DataTypes);
  var status = _status(sequelize, DataTypes);
  var tags = _tags(sequelize, DataTypes);
  var taxestype = _taxestype(sequelize, DataTypes);
  var tradeactivity = _tradeactivity(sequelize, DataTypes);
  var tradedocuments = _tradedocuments(sequelize, DataTypes);
  var userInformations = _userInformations(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var usersession = _usersession(sequelize, DataTypes);

  propertymilestones.belongsTo(developmentrounds, { as: "round", foreignKey: "roundID"});
  developmentrounds.hasMany(propertymilestones, { as: "propertymilestones", foreignKey: "roundID"});
  tradeactivity.belongsTo(developmentrounds, { as: "round", foreignKey: "roundID"});
  developmentrounds.hasMany(tradeactivity, { as: "tradeactivities", foreignKey: "roundID"});
  propertydocuments.belongsTo(documents, { as: "document", foreignKey: "documentID"});
  documents.hasMany(propertydocuments, { as: "propertydocuments", foreignKey: "documentID"});
  tradedocuments.belongsTo(documents, { as: "document", foreignKey: "documentID"});
  documents.hasMany(tradedocuments, { as: "tradedocuments", foreignKey: "documentID"});
  accountactivity.belongsTo(lov, { as: "subjectType_lov", foreignKey: "subjectType"});
  lov.hasMany(accountactivity, { as: "accountactivities", foreignKey: "subjectType"});
  bidders.belongsTo(marketplaceorders, { as: "order", foreignKey: "orderID"});
  marketplaceorders.hasMany(bidders, { as: "bidders", foreignKey: "orderID"});
  userInformations.belongsTo(paymentmode, { as: "paymentMode_paymentmode", foreignKey: "paymentMode"});
  paymentmode.hasMany(userInformations, { as: "userInformations", foreignKey: "paymentMode"});
  rolePermissions.belongsTo(permissions, { as: "permission", foreignKey: "permissionID"});
  permissions.hasMany(rolePermissions, { as: "rolePermissions", foreignKey: "permissionID"});
  developmentrounds.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(developmentrounds, { as: "developmentrounds", foreignKey: "propertyID"});
  portfoliobalance.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(portfoliobalance, { as: "portfoliobalances", foreignKey: "propertyID"});
  propertydocuments.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(propertydocuments, { as: "propertydocuments", foreignKey: "propertyID"});
  propertygallery.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(propertygallery, { as: "propertygalleries", foreignKey: "propertyID"});
  propertypricehistory.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(propertypricehistory, { as: "propertypricehistories", foreignKey: "propertyID"});
  propertystats.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(propertystats, { as: "propertystats", foreignKey: "propertyID"});
  propertytaxes.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(propertytaxes, { as: "propertytaxes", foreignKey: "propertyID"});
  propertyupdates.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(propertyupdates, { as: "propertyupdates", foreignKey: "propertyID"});
  tradeactivity.belongsTo(property, { as: "property", foreignKey: "propertyID"});
  property.hasMany(tradeactivity, { as: "tradeactivities", foreignKey: "propertyID"});
  propertyupdatestag.belongsTo(propertyupdates, { as: "update", foreignKey: "updateID"});
  propertyupdates.hasMany(propertyupdatestag, { as: "propertyupdatestags", foreignKey: "updateID"});
  rolePermissions.belongsTo(roles, { as: "role", foreignKey: "roleID"});
  roles.hasMany(rolePermissions, { as: "rolePermissions", foreignKey: "roleID"});
  users.belongsTo(roles, { as: "role", foreignKey: "roleID"});
  roles.hasMany(users, { as: "users", foreignKey: "roleID"});
  developmentrounds.belongsTo(status, { as: "status", foreignKey: "statusID"});
  status.hasMany(developmentrounds, { as: "developmentrounds", foreignKey: "statusID"});
  marketplaceorders.belongsTo(status, { as: "status", foreignKey: "statusID"});
  status.hasMany(marketplaceorders, { as: "marketplaceorders", foreignKey: "statusID"});
  property.belongsTo(status, { as: "propertyStatus_status", foreignKey: "propertyStatus"});
  status.hasMany(property, { as: "properties", foreignKey: "propertyStatus"});
  tradeactivity.belongsTo(status, { as: "status_status", foreignKey: "status"});
  status.hasMany(tradeactivity, { as: "tradeactivities", foreignKey: "status"});
  userInformations.belongsTo(status, { as: "status", foreignKey: "statusID"});
  status.hasMany(userInformations, { as: "userInformations", foreignKey: "statusID"});
  propertyupdatestag.belongsTo(tags, { as: "tag", foreignKey: "tagID"});
  tags.hasMany(propertyupdatestag, { as: "propertyupdatestags", foreignKey: "tagID"});
  propertytaxes.belongsTo(taxestype, { as: "tax", foreignKey: "taxID"});
  taxestype.hasMany(propertytaxes, { as: "propertytaxes", foreignKey: "taxID"});
  tradedocuments.belongsTo(tradeactivity, { as: "trade", foreignKey: "tradeID"});
  tradeactivity.hasMany(tradedocuments, { as: "tradedocuments", foreignKey: "tradeID"});
  accountactivity.belongsTo(users, { as: "user", foreignKey: "userID"});
  users.hasMany(accountactivity, { as: "accountactivities", foreignKey: "userID"});
  bidders.belongsTo(users, { as: "buyer", foreignKey: "buyerID"});
  users.hasMany(bidders, { as: "bidders", foreignKey: "buyerID"});
  marketplaceorders.belongsTo(users, { as: "seller", foreignKey: "sellerID"});
  users.hasMany(marketplaceorders, { as: "marketplaceorders", foreignKey: "sellerID"});
  portfoliobalance.belongsTo(users, { as: "user", foreignKey: "userID"});
  users.hasMany(portfoliobalance, { as: "portfoliobalances", foreignKey: "userID"});
  tradeactivity.belongsTo(users, { as: "agent", foreignKey: "agentID"});
  users.hasMany(tradeactivity, { as: "tradeactivities", foreignKey: "agentID"});
  tradeactivity.belongsTo(users, { as: "buyer", foreignKey: "buyerID"});
  users.hasMany(tradeactivity, { as: "buyer_tradeactivities", foreignKey: "buyerID"});
  tradeactivity.belongsTo(users, { as: "seller", foreignKey: "sellerID"});
  users.hasMany(tradeactivity, { as: "seller_tradeactivities", foreignKey: "sellerID"});
  userInformations.belongsTo(users, { as: "user", foreignKey: "userID"});
  users.hasMany(userInformations, { as: "userInformations", foreignKey: "userID"});
  usersession.belongsTo(users, { as: "user", foreignKey: "userID"});
  users.hasMany(usersession, { as: "usersessions", foreignKey: "userID"});

  return {
    // SequelizeMeta,
    accountactivity,
    bidders,
    developmentrounds,
    documents,
    lov,
    marketplaceorders,
    paymentmode,
    permissions,
    phonelookup,
    portfoliobalance,
    property,
    propertydocuments,
    propertygallery,
    propertymilestones,
    propertypricehistory,
    propertystats,
    propertytaxes,
    propertyupdates,
    propertyupdatestag,
    rolePermissions,
    roles,
    status,
    tags,
    taxestype,
    tradeactivity,
    tradedocuments,
    userInformations,
    users,
    usersession,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
