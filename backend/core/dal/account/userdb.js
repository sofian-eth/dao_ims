const db = require('../../dbModels/index');
const responseObject = require('../../dto/response/response-model');
const bankAccountResponse = require('../../dto/response/bankAccountResponse');
const userDetailResponse = require('../../dto/response/userResponse');
const { QueryTypes } = require('sequelize');
const getBankAccounts = async function (userID) {
    let resp = new responseObject();
    let _data = [];
    try {  

        var sql = `SELECT 
        userBankInformation.id,
        userBankInformation.accountTitle,
        IFNULL(banks.name,userBankInformation.bankName) as name,
        IFNULL(banks.svg,'') as bankLogo,
        userBankInformation.accountNumber,
        userBankInformation.iban,
        userBankInformation.branch,
        userBankInformation.bankId,
        userBankInformation.userID,
        userBankInformation.createdAt,
        userBankInformation.updatedAt 
        FROM userBankInformation left join banks on userBankInformation.bankId=banks.id WHERE userBankInformation.deleted=0 AND userBankInformation.userID=?`;
        let _banks = await db.sequelize.query(sql,{
            replacements: [userID],
            type: QueryTypes.SELECT
          });
    
        if (_banks) {
     
            _banks.forEach(_bank => {
                console.log("Bank1",_bank);
                let item = new bankAccountResponse.bankAccountResponse(_bank);
                _data.push(item);
            });
            resp.setSuccess("banks fetched");
            resp.data = _data;
        } else {
            resp.setError(_orders.toString(), "BANKS_NOT_FETCHED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "BANKS_NOT_FETCHED");
    }
    return resp;
}

const saveBankAccount = async function (bankAccount) {
    
    let resp = new responseObject();
    let _data = [];
    try {
        let _bankAccount;
        var sql = ``;
        let isRentalAccount=bankAccount.propertyID ? 1 : null;
        bankAccount.propertyID ? bankAccount.propertyID =bankAccount.propertyID : bankAccount.propertyID =null
        if (bankAccount.id > 0) {

            
            sql = `UPDATE userBankInformation
                    SET accountTitle=?,
                    accountNumber=?,
                    iban=?,                    
                    updatedAt=?,
                    isLinkedWithRental=?,
                    propertyID=?
                    WHERE id=?
                    AND userID=?`;
            
            let updatedAt=new Date()
            _bankAccount = await db.sequelize.query(sql,{
                replacements: [bankAccount.accountTitle,bankAccount.accountNumber,bankAccount.iban,updatedAt,isRentalAccount,bankAccount.propertyID,bankAccount.id,bankAccount.userID],
                type: QueryTypes.UPDATE
              });

            if (bankAccount.isRemoveError) {
                let sql2 = `update propertyUserRentDisbursements set isBankingError = 0 where userID = ${bankAccount.userID} and isBankingError = 1 and userBankInformationID = ${bankAccount.id}`;
                let result = await db.sequelize.query(sql2, {
                    replacements: [],
                    type: QueryTypes.UPDATE
                })
            }
            
        } else {


            sql = `INSERT INTO userBankInformation 
            (accountTitle,bankName,accountNumber,iban,branch,userID,createdAt,updatedAt,bankId,isLinkedWithRental,propertyID) 
            VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
            let createdAt, updatedAt;
            createdAt=new Date()
            updatedAt=new Date()
           
            _bankAccount = await db.sequelize.query(sql,{
                replacements: [bankAccount.accountTitle,bankAccount.bankName,bankAccount.accountNumber,bankAccount.iban,bankAccount.branch,bankAccount.userID,createdAt,updatedAt,bankAccount.bankId,isRentalAccount,bankAccount.propertyID],
                type: QueryTypes.INSERT
              });

        }
        
        if (_bankAccount) {
            _bankAccount.forEach(_bank => {
                let item = new bankAccountResponse.bankAccountResponse(_bank);
                _data.push(item);
            });
            resp.setSuccess("bank account information saved");
            resp.data = _data;
        } else {
            resp.setError(_orders.toString(), "BANKS_NOT_FETCHED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "BANKS_NOT_FETCHED");
    }
    return resp;
}





const deleteBankAccount = async function (id, userID) {
    let resp = new responseObject();
    let _data = [];
    try {
        const totalLinkedAccountsRes = await db.sequelize.query(`SELECT COUNT(*) as totalLinkedAccounts FROM orderPaymentMethods WHERE orderPaymentMethods.BankaccountID =?;`,{replacements:[id],type: QueryTypes.SELECT});
        if(totalLinkedAccountsRes && totalLinkedAccountsRes.length > 0 && totalLinkedAccountsRes[0].totalLinkedAccounts <= 0) {
            let _bankAccount;
            var sql = `UPDATE userBankInformation
            SET deleted=?,
            updatedAt=?,
            propertyID=null,
            isLinkedWithRental=null
            WHERE id=?
            AND userID=?`;
            let updatedAt=new Date(Date.now())
            _bankAccount = await db.sequelize.query(sql,
                {
                  replacements: [1,updatedAt,id,userID]
                }
              );
            if (_bankAccount && _bankAccount[0].affectedRows > 0) {
                resp.setSuccess("bank account deleted");
                resp.data = null;
            } else {
                resp.setError("You are not allowed to perform this action", "BANK_NOT_DELETED");
            }
        } else {
            resp.setError("This bank account is associated with the marketplace order.", "BANK_NOT_DELETED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "BANK_NOT_DELETED");
    }
    return resp;
}


const userDetails = async function(userId){
    let resp = new responseObject();
 
    try {  
      
        var sql = `SELECT * FROM users WHERE id=?`;
        let _user = await db.sequelize.query(sql,{replacements:[userId],type: QueryTypes.SELECT});
        if (_user) {
                var sqlQuery = `SELECT pb.balance,pb.netInvestment,p.name as propertyName FROM portfoliobalance as pb inner join property as p on pb.propertyID = p.id WHERE pb.userID=`+ userId;
                let _userInvestments = await db.sequelize.query(sqlQuery,{replacements:[userId],type: QueryTypes.SELECT});
                console.log("User Investments",_userInvestments);
                if(_userInvestments && _userInvestments.length > 0)
                    _user[0].activeInvestments = _userInvestments;
                
                console.log("User detail",_user[0]);
                let item = new userDetailResponse.userResponse(_user[0])
               
           
            resp.setSuccess("user fetched");
            resp.data = item;
        } else {
            resp.setError(_user.toString(), "USER_NOT_FETCHED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "USER_NOT_FETCHED");
    }
    return resp;
}

const userActiveInvestments = async function(userId){
    let resp = new responseObject();
 
    try {        
        var sql = `SELECT pb.balance,pb.netInvestment,p.name as propertyName FROM portfoliobalance as pb inner join property as p on pb.propertyID = p.id WHERE pb.userID=`+ userId;
        let _userInvestments = await db.sequelize.query(sql,{replacements:[userId],type: QueryTypes.SELECT});
        if (_user) {
                console.log("userInvestments",_userInvestments);
                let item = new userDetailResponse.userResponse(_user[0])
               
           
            resp.setSuccess("user fetched");
            resp.data = item;
        } else {
            resp.setError(_user.toString(), "USER_NOT_FETCHED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "USER_NOT_FETCHED");
    }
    return resp;
}

const getUserById =  async function(userId){
    const user = await db.sequelize.models.users.findByPk(userId);
    return user;
};

const getUserNameById = async function(userId){
    var sql = `select firstName, lastName, legalName from users where id =`+ userId;
    let result = await db.sequelize.query(sql,{replacements:[userId],type: QueryTypes.SELECT});
    return result;
}

const getUserOldAddress = async function(addressId){
    var sql = `select * from userAddressBook where id =`+ addressId;
    let result = await db.sequelize.query(sql,{replacements:[addressId],type: QueryTypes.SELECT});
    return result;
}

const saveUserAddress = async function (userAddress) {
    console.log("User address",userAddress);
    let resp = new responseObject();
    let _data = [];
    let objectID = userAddress.id ? userAddress.id : null;
    console.log(objectID)
    var sql = ``;

    try {
        let _userAddress;
        let isShipping = false;
        //let newID=0;
        if(userAddress.addressType == 'Home')
            isShipping = true;
            
            if( typeof(objectID) == 'object' ){
                sql = `INSERT INTO userAddressBook 
                (addressLine1,addressLine2,userID,city,country,isShipping,createdAt,updatedAt,addressType,isDeleted) 
                VALUES (?,?,?,?,?,?,?,?,?,?) `;
                let createdAt, updatedAt;
                createdAt=new Date(Date.now())
                updatedAt=new Date(Date.now())
                _userAddress = await db.sequelize.query(sql,
                    {
                      replacements: [userAddress.addressLine1,userAddress.addressLine2,userAddress.userID,userAddress.city,
                      userAddress.country,isShipping,createdAt,updatedAt,userAddress.addressType,false],
                      type: QueryTypes.INSERT,
                    }
                  );
                  //newID=await db.sequelize.query('select last_insert_id()')
            }
            else if(typeof(objectID) == 'number') {
                sql = `UPDATE userAddressBook SET addressLine1=?,addressLine2=?,city=?,country=? where id=?`
                console.log(sql , 'query')
                _userAddress = await db.sequelize.query(sql,
                    {
                      replacements: [userAddress.addressLine1,userAddress.addressLine2,userAddress.city,userAddress.country,objectID],
                      type: QueryTypes.UPDATE
                    }
                  ); 
            }

        
        if (_userAddress) {
            //resp.data=newID
            resp.setSuccess("User address information saved");
        } else {
            resp.setError(_orders.toString(), "ADDRESS_INFORMATION_NOT_SAVED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "ADDRESS_INFORMATION_NOT_SAVED");
    }
    return resp;
}

const removeUserAddress = async function(data){
    let resp = new responseObject();
    let _data = [];
    try {
        let _userAddress;
      
             
          var  sql = `update userAddressBook set isDeleted=true where id=? and userID=?`;

            _userAddress = await db.sequelize.query(sql,
                {
                  replacements: [data.id,data.userID],
                  type: QueryTypes.UPDATE
                }
              );

       
        
        if (_userAddress) {

            resp.setSuccess("User address information removed");
            
        } else {
            resp.setError(_orders.toString(), "ADDRESS_INFORMATION_NOT_SAVED");
        }
    } catch (ex) {
        console.log(ex);
        resp.setError(ex.toString(), "ADDRESS_INFORMATION_NOT_REMOVED");
    }
    return resp;


}
/**
 * 
 * @returns {Promise<responseObject>}
 */
const getBanks = async function (){
    let resp = new responseObject();
    const query = 'select id, name, logo, svg, 2x from banks where ifnull(isDeleted,0)=0;';
    resp.data = await db.sequelize.query(query,{type: QueryTypes.SELECT});
    return resp;
}
/**
 * 
 * @returns {Promise<responseObject>}
 */
const getBankById = async function(bankID){
    var sql = `select * from userBankInformation where deleted = 0 AND id =`+ bankID;
    let result = await db.sequelize.query(sql,{replacements:[bankID],type: QueryTypes.SELECT});
    return result;
}

/**
 * 
 * @returns {Promise<responseObject>}
 */
 const updateLegalInfo = async function (data){
    let resp = new responseObject();
    const query = 'update users set identityCardNumber=?,cnicFrontID=?,cnicBackID=?,NTN=?,isFiler=? where id = ?';
    resp.data = await db.sequelize.query(query,{replacements:[data.cnic,data.cnicFront,data.cnicBack,data.ntn,data.isFiler,data.userID],type: QueryTypes.UPDATE});
    return resp;
}
/**
 * 
 * @returns {Promise<responseObject>}
 */
const getUserLegalInfo = async function(userId){
    var sql = `select identityCardNumber, NTN, legalName from users where id =`+ userId;
    let result = await db.sequelize.query(sql,{replacements:[userId],type: QueryTypes.SELECT});
    return result;
}

/**
 * 
 * @returns {Promise<responseObject>}
 */
const updateUserDeviceToken = async function(data){
    let resp = new responseObject();
    const query = 'update users set device_token=? where id = ?';
    resp.data = await db.sequelize.query(query,{replacements:[data.device_token,data.userID],type: QueryTypes.UPDATE});
    return resp;
}

/**
 * 
 * @returns {Promise<responseObject>}
 */
const userRentalStats = async function(userId){
    const query = 'call sp_income_rentals(?);';
    let result = await db.sequelize.query(query,{replacements:[userId]});
    return result;
}


/**
 * 
 * @returns {Promise<responseObject>}
 */
const userRentalHistory = async function(userId){
    const query = 'select p.name as propertyName,p.propertyLogo ,prp.area,prp.occupancyPercentage,prp.rentPerUnit,prp.creditsPerUnit,prp.disbursedAt,prp.status,prp.rentDisbursementDuration,prp.rentDisbursementTime,prp.rentDisbursementYear from propertyRentPayouts as prp inner join property as p on prp.propertyID=p.id where prp.userID=? ;';
    let result = await db.sequelize.query(query,{replacements:[userId]});
    return result;
}


const userPortfolioBalance = async function(userId,propertyId){
    const query = `call sp_demarcated_user_balance(?,?);`;
    let result = await db.sequelize.query(query,{replacements:[userId,propertyId]});
  
    return result[0];
}


const getUserCurrencies = async function(){
    const query = `call sp_currencies();`;
    let result = await db.sequelize.query(query);
  
    return result;
}
module.exports = { getBankAccounts, saveBankAccount, deleteBankAccount,userDetails,userActiveInvestments, getUserById, getUserLegalInfo, getUserNameById, getUserOldAddress, saveUserAddress,removeUserAddress, getBanks, getBankById, updateLegalInfo,updateUserDeviceToken,userRentalStats,userRentalHistory,userPortfolioBalance ,getUserCurrencies};
