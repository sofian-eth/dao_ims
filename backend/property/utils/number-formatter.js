

function numberFormatter(value) {
    return Math.abs(Number(value)) >= 1.0e+9

    ? Math.abs(Number(value)) / 1.0e+9 + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(value)) >= 1.0e+6

    ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(value)) >= 1.0e+3

    ? Math.abs(Number(value)) / 1.0e+3 + "K"

    : Math.abs(Number(value));

}


function checkNegativeValue(value){
    if(value < 0 )
        return 0;
    else 
    return value;    
}

function checkMaximumPercentage(value){
    if(value > 100)
    return 100;
    else 
    return value
}

module.exports = { numberFormatter,checkNegativeValue,checkMaximumPercentage };