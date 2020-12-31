const validators = {
  install(Vue) {
    Vue.mixin({
      methods: {
        emailRule(val) {

          /**
           * Using Regex to determine if value is in the proper format for an email
           * Must include at least 1 character before and after a required '@' and 2 characters after final '.'
           *
           * For help understanding the Regex >>       https://www.debuggex.com/
           *                                     ^^ command-click or command-b to open ^^
           */

          let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
          return reg.test(val) || 'Must be valid email';
        },
        notEmptyRule(val) {
          return !!val.length || 'Cannot be empty';
        },
        ssnRule(val){
          return val.length === 11 || 'Requires 9 digits ###-##-####';
        },
        dobRule(val){
          return val.length === 10 || 'Requires 8 digits YYYY-MM-DD';
        },
        matchingRule(val, pass) {
          /*You must run this inside an anonymous function to get val
          * e.g >> val => {matchingRule(val, password)}
          * */
          return val === pass || 'Passwords must match.';
        },
        passwordCheckRule(val) {

          /**
           * Using Regex to determine the strength of a password
           * Requires a password to be strong in strength
           * Must include a lowercase letter, uppercase letter, number, special character, and be >= 8 characters
           * Validates password and returns either a message for what is missing or true
           *
           * Will throw an error if value passed is not a string
           *
           * Can be used in conjunction with passwordStrength for displaying password validation to a user
           * For help understanding the Regex >>       https://www.debuggex.com/
           *                                     ^^ command-click or command-b to open ^^
           */

          const minLength = val.length >= 8;
          const includeSpecial = /[!@#$%^&*]/;
          const includeNumber = /\d/;
          const includeUppercase = /[A-Z]/;
          const includeLowercase = /[a-z]/;
          if (typeof val !== 'string') {
            throw new TypeError(`path: plugins/validators.js  --  password strength validation error: expected type 'string' - got ${typeof val}`);
          } else if (this.passwordStrength(val) === 'Strong') {
            return true;
          } else if (!minLength) {
            return 'Minimum Length is 8';
          } else if (!includeSpecial.test(val)) {
            return 'You must include a special character';
          } else if (!includeNumber.test(val)) {
            return 'You must include a number';
          } else if (!includeUppercase.test(val)) {
            return 'You must include an uppercase letter';
          } else if (!includeLowercase.test(val)) {
            return 'You must include a lowercase letter';
          } else {
            return true;
          }
        },
        passwordStrength(val) {

          /**
           * Using Regex to determine the strength of a password
           *
           * Strong - must include a lowercase letter, uppercase letter, number, special character, and be >= 8 characters
           * Medium - must include either an upper or lower case letter, with either a number and/or a special character
           *    and be >= 6 characters
           * Weak - determined by being neither Medium nor Strong in strength
           *
           * Will also return 'empty' if the value passed in does not have length
           * Will throw an error if value passed is not a string
           *
           * For help understanding the Regex >>       https://www.debuggex.com/
           *                                     ^^ command-click or command-b to open ^^
           */

          const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');
          const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z,A-Z])(?=.*[0-9]))|((?=.*[a-z,A-Z])(?=.*[!@#$%^&*]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
          if (typeof val !== 'string') {
            throw new TypeError(`path: plugins/validators.js  --  password strength validation error: expected type 'string' - got ${typeof val}`);
          } else if (!val.length) {
            return 'empty';
          } else if (strongRegex.test(val)) {
            return 'Strong';
          } else if (mediumRegex.test(val)) {
            return 'Medium';
          } else {
            return 'Weak';
          }
        },
        creditCardLength(val) {
          const re = new RegExp('^(34|37)');
          if (val.match(re) != null) return val.length === 17 || 'Number must be 15 digits';
          return val.length === 19 || 'Number must be 16 digits';
        },
        validUrl(val) {
          const re = new RegExp(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i);
          return re.test(val) || 'Must be a valid url';
        }
      }
    });
  }

};

export default validators;
