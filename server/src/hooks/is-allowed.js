/* eslint-disable require-atomic-updates */
const lget = require('lodash.get');

const isAllowed = async (context, actions, subjects) => {
  let idList = [].concat.apply([], lget(context, 'params.user._fastjoin.roles', []).map(role => role.rules));
  let rulesList = await context.app.service('rules').find({
    query: {
      _id: { $in: idList },
      // TODO: finish changing this to db query filter instad of javascript
      // actions: { $all: actions },
      // subject: { $all: actions },
    }
  });

  // console.log('allowing', actions, subjects, this.rulesList);
  let boo = false;
  if(rulesList && rulesList.data.length) {
    rulesList.data.forEach(a => {
      !actions.some(act => !a.actions.includes(act)) && !subjects.some(subj => !a.subject.includes(subj)) ? boo = true : '';
    });
  }
  // console.log('server side isAllowed', actions, subjects, idList, rulesList, boo);
  return boo;
};

const checkAllowed = function (pass, check, prop) { // eslint-disable-line no-unused-vars
  return async context => {
    // let method;
    // if(context.method === 'patch' || context.method === 'update') {
    //   method = 'update';
    // } else method = context.method;
    // eslint-disable-next-line no-console
    if (!pass || !check) {
      if (lget(context, 'user._id', false)) {
        let user = context.user ? context.user : context.params.user;
        // eslint-disable-next-line no-console
        console.log('rules log before pass check', prop, check, pass, context.path, context.method);
        let ro = user._fastjoin.roles;
        let list = [];
        if (ro) {
          list = [].concat.apply([], ro.map(a => a.rules));
          // throw new Error('is-not-allowed User has role but no matching rules for this action');
        } else {
          throw new Error('is-not-allowed No user role');
        }
        // eslint-disable-next-line no-console
        console.log('rules log', context.path, context.method);
        let method;
        if (['find', 'get'].includes(context.method)) {
          method = 'read';
        } else if (['update', 'patch'].includes(context.method)) {
          method = 'update';
        } else if (context.method === 'remove') {
          method = 'delete';
        } else if (context.method === 'create') method = 'create';

        await context.app.service('rules').find({
          query: {
            _id: { $in: list }
          }
        })
          .then(rs => {
            // eslint-disable-next-line no-console
            console.log('searched rules', rs.data.length, context.path, context.method);
            let test = false;
            if (rs.data) {
              // eslint-disable-next-line no-console
              console.log('found rules', rs.data.length);
              rs.data.forEach(a => {
                // eslint-disable-next-line no-console
                console.log(a.subject, context.path, a.actions, method);
                if (a.subject.includes(context.path) && a.actions.includes(method)) {
                  // eslint-disable-next-line no-console
                  console.log('got one');
                  return test = true;
                }
              });
            } else {
              throw new Error('is-not-allowed No matching rules found for user');
            }
            if (test) {
              return context;
            } else {
              throw new Error('is-not-allowed none of user roles have matching rules for', context.path, context.method);
            }
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.log('rules find err', err);
            throw new Error('is-not-allowed could not retrieve rules to check is-allowed');
          });
      } else {
        return context;
      }
    } else return context;
  };
};

const isWhitelist = (context, pass) => {
  let userId = lget(context, 'user._id', lget(context, 'params.user._id'));
  let passId = lget(context, ['data', pass], lget(context, ['result', pass]));
  let freePass = userId === passId;
  let email = lget(context, 'user.email', lget(context, 'params.user.email'));
  let whiteList = ['tyler@ionrev.com', 'tyler1@ionrev.com', 'dev@ionrev.com', 'bryce@ionrev.com', 'dallin@ionrev.com', 'tjohnson@ionrev.com'];
  if(freePass || whiteList.includes(email.toLowerCase())) return context;
  else throw new Error('email not whitelisted to make these changes');
};

module.exports = {
  checkAllowed,
  isAllowed,
  isWhitelist
};
