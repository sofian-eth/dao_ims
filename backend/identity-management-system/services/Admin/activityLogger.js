const { sequelize } = require('core/dbModels');
const requestIp = require('request-ip');
const { QueryTypes } = require("sequelize");
// const { knex } = require('../../../property/Models/db.js');
// const { fetchLocationFromIP } = require('../../utility/fetch-location');
    // type Activity {
    //     logName: string;
    //     description: string;
    //     subjectID: number;
    //     subjectType: string;
    //     event: string;
    //     causerID: number;
    //     causerType: string;
    //     properties: {
    //         attributes: {[key: string]: any},
    //         old: {[key: string]: any}
    //     };
    //     source: {
    //         ipAddress: string,
    //         userAgent: string
    //     };
    // }

const logActivity = async function(activity, request=null, causer=null) {
    try {
        if( request && activity ) {
           
            const ipAddress = requestIp.getClientIp(request); ;
            const userAgent = request.headers['user-agent'];
            activity.source = {
                ipAddress,
                userAgent
            };
            if( causer && causer.id && causer.type ) {
                activity.causerID = causer.id;
                activity.causerType = causer.type;
            } else {
                if( request.decoded && request.decoded.id ) {
                    activity.causerID = request.decoded.id;
                    activity.causerType = 'users';
                }
            }
            const location = null;
            try {
                //await fetchLocationFromIP(ipAddress);
                // const location = await fetchLocationFromIP(ipAddress);
                activity.source.location = location;
            } catch(e) { }
            let roles;
            if(request.decoded.roleID){
                roles=await sequelize.query('select name as rolename from roles where id='+request.decoded.roleID,{ type: QueryTypes.SELECT } )
                let a =roles;
            }
            let setroles=[];
            
            if(request.decoded.roleID && roles){
                for (let i=0;i<roles.length-1;i++){
                    let data=roles[i][0].rolename;
                    setroles[i]= {roleName: String}
                    setroles[i].roleName  = data
                }
                roles=setroles;
                activity.metadata= {
                    roles
                };
                
            }
           
            return insertActivityLog(activity);
        } else {
         return null;   
        }
    } catch(e) {
        return null;
    }
}

const insertActivityLog = async function(obj) {
    const keys = Object.keys(obj).filter(item => ['logName', 'description', 'subjectID', 'subjectType', 'event', 'causerID', 'causerType', 'properties', 'source', 'metaData' ]);
        if( keys.length > 0 ) {
            let mapping=keys.map(item => ['properties', 'source', 'metadata'].includes(item.toLocaleLowerCase()) ? obj[item]=JSON.stringify(obj[item]) : obj[item]);
            let query=`INSERT INTO activityLogs(${keys.join(",")}) VALUES (${keys.map(item => `'${obj[item]}'`).join(",")})`;
            let result = await sequelize.query(query).then((x)=>{
                    console.log(x);
                }).catch((err)=>{
                    console.log(err);
                })
            if( Array.isArray(result) && result.length > 0 ) {
                obj.id = result[0].insertId;
                return obj;
            } else {
                return null;
            }
        } else {
            return null;
        }
}

module.exports = { logActivity };