var rp = require('request-promise');
const dotenv = require('dotenv');
dotenv.config();

const fetchLocationFromIP = function(ipAddress) {
    const localhostIpAddresses = ['127.0.0.1', '::1', '::ffff:127.0.0.1'];
    return rp(`http://ip-api.com/json/${ipAddress && (!localhostIpAddresses.includes(ipAddress)) ? ipAddress : ''}`)
            .then(function (res) {
                const result = JSON.parse(res);
                console.log("Location resutl", result);
                if( result.status==='success' ){ 
                    const { country=null, regionName=null, city=null, zip=null } = result;
                    return {
                        country,
                        regionName,
                        city,
                        zip
                    };
                } else {
                    return null;
                }
            });

}

module.exports = { fetchLocationFromIP };