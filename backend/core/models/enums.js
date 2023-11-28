module.exports = {
    orderStatus: {
        "active": "active",
        "completed": "completed",
        "discarded": "discarded",
        "disputed": "disputed"
    },
    orderPaymentStatusEnum: {
        "pending": "pending",
        "paid": "paid",
        "approved": "approved",
        "reversed": "reversed",
        "disputed": "disputed",
        "discarded": "discarded"
    },
    orderPaymentTypeEnum: {
        "token": "token",
        "servicecharges": "servicecharges",
        "other": "other",
    },

    orderPaymentTypeEnumEmail: {
        "token": "Security Amount",
        "servicecharges": "Service Charges",
        "other": "Others",
    },
    orderItemStatus: {
        "active": "active",
        "completed": "completed",
        "discarded": "discarded",
        "disputed": "disputed"
    },
    disputeStatus: {
        "active": "active",
        "resolved": "resolved",
        "deffered": "deffered"
    },
    disputeAction: {
        "open": "open",
        "resolve": "resolve",
        "deffer": "deffer"
    },
    showBankInformationAction: {
        "request": "request",
        "deny": "deny",
        "allow": "allow"
    },
    BankInformationActionEnums: {
        "requested": "requested",
        "rejected": "rejected",
        "allowed": "allowed"
    },
    PropertyCategory: {
        "developmental": "development",
        "mature": "mature",
    },
    orderTimeExtensionRequestStatus: {
        "REQUESTED": "REQUESTED",
        "ACCEPTED": "ACCEPTED",
        "REJECTED": "REJECTED",
    },
    serviceChargesMethod: {
        'area': 'area',
        'bank': 'bank'
    },

    demarcatedOptions:{
        '1': 'ONE_BED_APARTMENT',
        '2': 'TWO_BED_APARTMENT',
        '3': 'THREE_BED_APARTMENT',
        '4': 'FOUR_BED_APARTMENT'

    }
}