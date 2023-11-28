const s3 = require("./../../utils/aws-utils");
/**
 * 
 * @param {String} key 
 */
const getFileUrl = async function(key){
     const url = await s3.generateSignedUrl(key);
     return {url};
}

module.exports = {
    getFileUrl
}