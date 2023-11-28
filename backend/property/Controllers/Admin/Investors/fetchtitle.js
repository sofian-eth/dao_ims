

const userInformationModel = require('../../../Models/Admins/Investors/title');

// const fetchtitlecontroller = function (req, res, next) {
//     let err = {};
//     titledb.fetchtitle(req.body)
//         .then(function (result) {

//             if (!result.length)
//                 throw 'Record not found';

         
//             res.status(200).json({ error: false, message: '', data: result });
//         })
//         .catch(function (error) {
//             err.statusCode = 400;
//             err.message = "Error occurred in fetching user Information";
//             err.stackTrace = error;
//             next(err);
//         })


// }


async function fetchUserInformation(req,res,next){
    let err = {};

    try {

        let userInformation = await userInformationModel.userInformation(req.body);
        return res.status(200).json({error:false,message: '',data:userInformation});
       
    

    } catch(error){
        console.log(error);
        err.statusCode = 400;
        err.message = "Error occurred in fetching user Information";
        err.stackTrace = error;
        next(err);
   
    }
}


module.exports = {fetchUserInformation };