function convertToSqft(quantity) {
    let decimalUnits = 10000;
    return new Promise(function (resolve, reject) {
        var areaUnits = quantity / decimalUnits;

        resolve(areaUnits);


    });


}


function convertToSutar(quantity) {
    let decimalUnits = 10000;

    return new Promise(function (resolve, reject) {
        var areaUnits = quantity * decimalUnits;

        resolve(areaUnits);


    });

}


module.exports.convertToSqft = convertToSqft;
module.exports.convertToSutar = convertToSutar;