const Validator = require("validator");
const isEmpty = require("./is-empty");
const { check, checkBody } = require("express-validator");

const validateTwilio = (data) => {
  let errors = {};
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  if (!Validator.isMobilePhone(data.phoneNumber)) {
    errors.phoneNumber = "valid phone Number is required";
  }
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "phone Number field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateEmailSignup = function (data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";

  data.password = !isEmpty(data.password) ? data.password : "";
  
  
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is in incorrect format";
  }

  let customNormalizeEmail = data.email;
  data.email = customNormalizeEmail.toLowerCase();

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateEmailVerification = function(data){

  let errors = {};
  data = !isEmpty(data) ? data : "";
  if (Validator.isEmpty(data)) {
    errors.token = "Token is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
const validateCNIC = function(data){

  let errors = {};
  data.identityCardNumber = !isEmpty(data.identityCardNumber) ? data.identityCardNumber : "";
  if (Validator.isEmpty(data.identityCardNumber)) {
    errors.cnic = "Identity Card is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
const validateBillingInfo = function(data){

  let errors = {};
 
  data.city = !isEmpty(data.city) ? data.city : "";
  if (Validator.isEmpty(data.city)) {
    errors.city = "City is required";
  }
  data.country = !isEmpty(data.country) ? data.country : "";
  if (Validator.isEmpty(data.country)) {
    errors.country = "Country is required";
  }
  data.billingAddress = !isEmpty(data.billingAddress) ? data.billingAddress : "";
  if (Validator.isEmpty(data.billingAddress)) {
    errors.billingAddress = "Billing Address is required";
  }
 
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
const validatePhone = function(data){
consol.log('-----------------2')
data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
data.code = !isEmpty(data.code) ? data.code : "";
if (!Validator.isMobilePhone(data.phoneNumber)) {
  errors.phoneNumber = "valid phone Number is required";
}
if (Validator.isEmpty(data.phoneNumber)) {
  errors.phoneNumber = "phone Number field is required";
}
if (Validator.isEmpty(data.code)) {
  errors.phoneNumber = "Verfication Code is required";
}
  return {
    errors,
    isValid: isEmpty(errors),
  };
}
const validateUpdatePassword = function(data){

  let errors = {};
  data = !isEmpty(data) ? data : "";
  if (Validator.isEmpty(data)) {
    errors.password = "Password is required";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
}

const validateSignupForm = function (data) {

  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";

  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is in incorrect format";
  }

  let customNormalizeEmail = data.email;
  data.email = customNormalizeEmail.toLowerCase();

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }
  // else
  // {

    // if (!Validator.isEmpty(data.password)) {
      // if(check(data.password).isLength({ min: 5, max:15})){
        
      //   errors.password = "Please enter valid password";
      // }
      //  else if(check(data.password).isLength({ max: 15})){
        
        //     errors.password = "Password is too large. Please enter valid password";
        //   }
        // }
      // }
        
  return {
    errors,
    isValid: isEmpty(errors),
  };

};

const validateEmailLogin = function (data) {
  let errors = {};
  
  data.email = !isEmpty(data.email) ? data.email : "";

  data.password = !isEmpty(data.password) ? data.password : "";
  if (Validator.isEmpty(data.email)) {
    errors = "Email is required";
  }

  // if (!Validator.isEmail(data.email)) {
  //   errors = "Email is in incorrect format";
  // }
  // let customNormalizeEmail = data.email;
  // data.email = customNormalizeEmail.toLowerCase();

  if (Validator.isEmpty(data.password)) {
    errors = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateChangePassword = function (data) {
  let errors = {};
  if(!data.isSocialUser){
    data.currentPassword = !isEmpty(data.currentPassword)
    ? data.currentPassword
    : "";
    if (Validator.isEmpty(data.currentPassword)) {
      errors = "Current password is required";
    }
  }

  data.newPassword = !isEmpty(data.newPassword) ? data.newPassword : "";

  if (Validator.isEmpty(data.newPassword)) {
    errors = "New password is required";
  }
  let passwordRegex = new RegExp(
    "^(?=.*?[A-Z])(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$"
  );

  if (passwordRegex.test(data.newPassword)) {
    errors = "Please create strong password";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateChangeEmail = function (data) {
  let errors = {};
  data.email = !isEmpty(data.email) ? data.email : "";
  let customNormalizeEmail = data.email;
  data.email = customNormalizeEmail.toLowerCase();
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email address is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is in incorrect format ";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateTwilioVerify = (data) => {
  let errors = {};
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";
  data.code = !isEmpty(data.code) ? data.code : "";

  if (!Validator.isMobilePhone(data.phoneNumber)) {
    errors.phoneNumber = "valid phoneNumber is required";
  }
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "phoneNumber field is required";
  }
  if (Validator.isEmpty(data.code)) {
    errors.code = "code is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateAdminSignup = (data) => {
  let errors = {};
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "first Name is required";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "last Name is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is in incorrect format";
  }

  let customNormalizeEmail = data.email;
  data.email = customNormalizeEmail.toLowerCase();
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateInvestorSignup = (data) => {
  let errors = {};
  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.phoneNumber = !isEmpty(data.phoneNumber) ? data.phoneNumber : "";

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "first Name is required";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "last Name is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  let customNormalizeEmail = data.email;
  data.email = customNormalizeEmail.toLowerCase();

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is in incorrect format";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if (Validator.isEmpty(data.phoneNumber)) {
    errors.password = "Phone Number is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateAdminRemove = (data) => {
 
  let errors = {};
  data.id = !isEmpty(data.id) ? data.id : "";
  if (Validator.isEmpty(data.id)) {
    errors.id = "Admin ID is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = {
  validateTwilio,
  validateTwilioVerify,
  validateEmailSignup,
  validateEmailLogin,
  validateChangePassword,
  validateChangeEmail,
  validateAdminSignup,
  validateAdminRemove,
  validateSignupForm,
  validateEmailVerification,
  validateUpdatePassword,
  validatePhone,
  validateCNIC,
  validateBillingInfo
};
