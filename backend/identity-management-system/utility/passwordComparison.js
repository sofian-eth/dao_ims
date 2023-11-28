const bcryptjs = require('bcryptjs');

function comparePwd(param1, param2) {

    return new Promise(function (resolve, reject) {
        bcryptjs.compare(param1, param2, function (err, res) {
            if (err) {

                reject(err);
            } else {

                resolve(res);
            }
        });
    });
}


module.exports.comparePwd = comparePwd;