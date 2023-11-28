// const { knex } = require('core/models/db');
// const requestIp = require('request-ip');

// //const { insertActivityLog } = require('../../../property/Models/Shared/account-activity.js'); 
// // const { fetchLocationFromIP } = require('../../../property/utils/utils.js');

//     // type Activity {
//     //     logName: string;
//     //     description: string;
//     //     subjectID: number;
//     //     subjectType: string;
//     //     event: string;
//     //     causerID: number;
//     //     causerType: string;
//     //     properties: {
//     //         attributes: {[key: string]: any},
//     //         old: {[key: string]: any}
//     //     };
//     //     source: {
//     //         ipAddress: string,
//     //         userAgent: string
//     //     };
//     // }

// const logActivity = async function(activity, request=null, causer=null) {
//     try {
//         if( request && activity ) {
//             const ipAddress = requestIp.getClientIp(request); ;
//             const userAgent = request.headers['user-agent'];
//             activity.source = {
//                 ipAddress,
//                 userAgent
//             };
//             if( causer && causer.id && causer.type ) {
//                 activity.causerID = causer.id;
//                 activity.causerType = causer.type;
//             } else {
//                 if( request.decoded && request.decoded.id ) {
//                     activity.causerID = request.decoded.id;
//                     activity.causerType = 'users';
//                 }
//             }
//             const location = null;
//             try {
//                 const location = await fetchLocationFromIP(ipAddress);
//                 activity.source.location = location;
//             } catch(e) { }
//             let roles;
//             if(request.decoded.roleID){
//                 roles=await knex.raw('select name as rolename from roles where id=?',request.decoded.roleID)
//             }
//             let setroles=[];
            
//             if(request.decoded.roleID && roles){
//                 for (let i=0;i<roles.length-1;i++){
//                     let data=roles[i][0].rolename;
//                     setroles[i]= {roleName: String}
//                     setroles[i].roleName  = data
//                 }
//                 roles=setroles;
//                 activity.metadata= {
//                     roles
//                 };
                
//             }
//             return insertActivityLog(activity);
//         } else {
//          return null;   
//         }
//     } catch(e) {
//         return null;
//     }
// }

// module.exports = { logActivity };