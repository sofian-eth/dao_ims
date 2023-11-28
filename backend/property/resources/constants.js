const TRANSACTION_STATUSES = {
    PENDING: 'pending',
    PLEDGE_SUBMITTED: 'pledge submitted',
    PLEDGE_CONFIRMED: 'pledge confirmed',
    LOCKED: 'locked',
    CONFIRMED: 'confirmed',
    DISCARDED: 'discard',
};
const ERROR_MESSAGES = {
    CURRENT_PASS_INCORRECT:"You have entered an incorrect password. Please try again.",
    INSUFFICIENT_ACCESS:"Insufficient access",
    USER_NOT_FOUND: "User is not exist.",
    PHONE_NUMBER_INVALID: "Phonenumber is not valid.",
    OTP_INVALID: "OTP_INVALID",
    SERVER_ERROR: "Server error."
};

const DEAl_CHANGE_ENUMS = {
    BANK_REQUEST:0,
    AMOUNT_PAID:1,
    AMOUNT_ACCEPTED:2,
    DEAl_COMPLETED:3,
    SERVICE_CHARGES_APPROVED:4
}


const DEMARCATED_UNIT_SPACE_TYPE = {
    ONE_BED_APARTMENT : '1 Bed Room Apartment',
    TWO_BED_APARTMENT : '2 Bed Room Apartment',
    TWO_ONE_BED_APARTMENT : '2+1 Bed Room Apartment',
    THREE_BED_APARTMENT : '3 Bed Room Apartment',
    FOUR_BED_APARTMENT: '4 Bed Room Apartment'
}

module.exports = {
    TRANSACTION_STATUSES,
    ERROR_MESSAGES,
    DEAl_CHANGE_ENUMS,
    DEMARCATED_UNIT_SPACE_TYPE
};