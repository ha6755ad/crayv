
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const lget = require('lodash.get');
const lset = require('lodash.set');

const sanitize = require('../utils/sanitization/sanitize');

// eslint-disable-next-line no-unused-vars
module.exports = ({paths = ['data.body'], arrayPaths = [{arrayPath: 'data.responses', valuePath: 'body.html'}], sanitizeOptions = {}} = {}) => {
  return async context => {
    for (let path of paths) {
      let html = lget(context, path);
      if (html instanceof String) lset(context, path, sanitize(html, sanitizeOptions));
    }

    for (let path of arrayPaths) {
      let arr = lget(context, path.arrayPath, []);
      if (Array.isArray(arr) && arr.length) {
        lset(context, path.arrayPath, arr.map(obj => {
          let html = lget(obj, path.valuePath);
          if (html instanceof String) lset(obj, path.valuePath, sanitize(html, sanitizeOptions));
        }));
      }
    }
    return context;
  };
};

