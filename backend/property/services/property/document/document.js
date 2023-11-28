const documentModel = require('../../../Models/Property/documents');
const core = require('core');


async function fetchDocuments(req,res,next){
    let err = {};
    var propertyId = req.query.propertyId;
    let propertyDocuments=[];

    try {
        let documents = await documentModel.fetchDocuments(propertyId);
        // documents.forEach(element => {
        //     return core.fileuploader.getMedia(element.relativePath)
        //             .then(function(result){
        //                 console.log(result);
        //                 let jsonObject = {
        //                     originalFileName : element.title, 
        //                     documentType:element.documentType,
        //                      mediaID: element.mediaId,
        //                       url: result
        //                }
        //                propertyDocuments.push(jsonObject);
                    
        //             })
                   
           
       //});

        return res.status(200).json({error:false,message:'',data: documents});
      


    } catch(error){
        console.log(error);
      
        err.statusCode = 400;
        err.message = "Error occurred in fetching projects";
        err.stackTrace = error;
        next(err);
    }
    }

    // documentModel.fetchDocuments(propertyId)
    //     .then(function (result) {
    //         res.status(200).json({ error: false, message: '', data: result });
    //     })
    //     .catch(function (error) {
    //         err.statusCode = 400;
    //         err.message = "Error occurred in adding project document";
    //         err.stackTrace = error;
    //         next(err);

         
    //     })




module.exports.fetchDocuments = fetchDocuments;