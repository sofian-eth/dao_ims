

const blockchainutils = require('../../../utils/blockchain-utils.js');

const totaltokens = function(req,res){

    return blockchainutils.gettotaltokens()
        .then(function(result){
            res.json(result);
        })
        .catch(function(error){
          
            res.sendStatus(500);
        })

}

const circulationtokens = function(req,res){

    return blockchainutils.circulationtokens()
    .then(function(result){
        res.json(result);
    })
    .catch(function(error){
        res.sendStatus(500);
    })
}


const blockhainareasold = function(req,res){
    var daowallet;
    var circulationtoken;
    var areasold;
    return blockchainutils.userbalance()
        .then(function(result){
            daowallet = result;
            return blockchainutils.circulationtokens()
        })
        .then(function(result){
            circulationtoken = result;
            areasold = 100 - (daowallet/circulationtoken)*100;
            res.json(areasold);

        })
        .catch(function(result){
            res.sendStatus(500);
        })
}


module.exports={totaltokens,circulationtokens,blockhainareasold}