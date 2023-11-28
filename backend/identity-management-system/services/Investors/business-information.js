const {users,goalenum, usergoals, investmentEnum, userInvestment} =  require('../../models/index');
const { Op, QueryTypes } = require("sequelize");
const { AssignedAddOnContext } = require('twilio/lib/rest/api/v2010/account/incomingPhoneNumber/assignedAddOn');
const sequelize = require('../../utility/dbConnection');

const baseResponseModel = require('../../dto/response-model');
const constantMessage = require('../../resources/constant');

// const { response } = require('express');

// all business related apis

// get
async function goalFetch(req,res,next){
    let err = {};
    let response = new baseResponseModel();
    try{
        let QueryGoals = await goalenum.findAll({
            attributes: ["id","name"]
        })
        if(QueryGoals){
           response.data = QueryGoals;
        }
    }catch(error){
      
        response.exception = error;
        response.setError(constantMessage.UNABLE_FETCH_GOAL);
    }

    finally{
    return res.status(200).json(response)

    }
} 



async function investmentEnums(req,res,next){
let err = {}
let investmentData;
let response = new baseResponseModel();
try{
    investmentData = await investmentEnum.findAll({
        raw: true,
    })
    if(investmentData){
        response.data = investmentData;
    }


}catch(error){
    response.exception = error;
    response.setError(constantMessage.ERROR_OCCURRED);
}finally{
   return res.status(200).send(response);
}
}

async function saveUserBusinessInformation(req,res,next){
    let err = {};
    let isOptionalInformationAvailable = false;
    let response = new baseResponseModel();
    let transaction;
    try{
        let userInformation = await users.findOne(
            {where:
                {id: req.decoded.id
                },
                raw:true
            });

        transaction = await sequelize.transaction();
       
        if(userInformation.isOptionalInformationAvailable){
         response.setError(constantMessage.UNABLE_SAVE_INFO);
         return;
        }
            
        let minInvestmentBudget = req.body.minInvestmentBudget || null ; 
        let maxInvestmentBudget = req.body.maxInvestmentBudget || null;
        
        let investmentOptions = [];
        investmentOptions = req.body.investmentOptions;

        var goals =[];
    
       
        goals = req.body.goals;
       


        if((investmentOptions.length!=0) && (goals.length!=0) ){
            isOptionalInformationAvailable = true;
        } 
        else {
            response.setError(constantMessage.ERROR_OCCURRED);
            return;
        }
        var userInvestmentArr = [];
        investmentOptions.forEach(i => {
            userInvestmentArr.push({investmentID:i,userID:req.decoded.id})
        });
       
       var userGoals=[]
        goals.forEach(i => {
            userGoals.push({goalId:i,userId:req.decoded.id})
        });

   
        let addInvestments = await userInvestment.bulkCreate(
            userInvestmentArr,
         { transaction });

        let addGoals = await usergoals.bulkCreate(
            userGoals,
         { transaction });

         let updateUsers =   await users.update({
                isOptionalInformationAvailable:isOptionalInformationAvailable,
                minInvestmentBudget : minInvestmentBudget,
                maxInvestmentBudget : maxInvestmentBudget,
            },
            {
                where:{id:req.decoded.id}
            }, { transaction })

            await transaction.commit();

            response.message = constantMessage.USER_INFO_UPDATED_SUCCESS;

    }catch(error){
        
        if(transaction) await transaction.rollback();
        console.log(error);
        response.exception = error;
        response.setError(constantMessage.UNABLE_SAVE_INFO)
     
    } 

    finally{
    return res.status(200).json(response);
    }
} 



async function fetchAdditionalInformation(req,res,next){
    let err = {};
    let response = new baseResponseModel();
    try {
        let userID = req.decoded.id;
        let userInformation = await users.findOne({ where: { id: userID } });
        let outputObject = {
          is_user_optional_info: userInformation.isOptionalInformationAvailable,
        };
        response.data = outputObject;
       

    } catch(error){
        response.exception = error;
        response.setError(constantMessage.UNABLE_FETCH_BUSSI_INFO);
       
    }
    finally {
    return res.status(200).json(response);
    }
}


module.exports.goalFetch = goalFetch;
module.exports.investmentEnums = investmentEnums;
module.exports.saveUserBusinessInformation = saveUserBusinessInformation;
module.exports.fetchAdditionalInformation = fetchAdditionalInformation