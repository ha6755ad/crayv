import Vue from 'vue';

const lget = require('lodash.get');
const lset = require('lodash.set');
import {Notify, Dialog} from 'quasar';

export default async () => {
  Vue.prototype.$setPhone = (number, isValid, path) => {
    return path ? lget(number.isValid, 'path') : isValid;
  };

  Vue.prototype.$getDefaultProfileAddress = (person, defaultPath) => {
    let def = defaultPath ? defaultPath : 'address';
    return lget(person, 'settings.defaults.address', lget(person, [def], null));
  };

  Vue.prototype.$getDefaultProfilePhone = (person, defaultPath, path) => {
    let def = defaultPath ? defaultPath : `phone${path ? '.' + path : ''}`;
    let phonePath = path ? `settings.defaults.phone.${path}` : 'settings.defaults.phone';
    return lget(person, phonePath, lget(person, [def], null));
  };

  Vue.prototype.$getDefaultProfileEmail = (person, defaultPath) => {
    let def = defaultPath ? defaultPath : 'email';
    return lget(person, 'settings.defaults.email', lget(person, [def], null));
  };

  Vue.prototype.$setDefaultProfileItem = async (person, path, val) => {
    lset(person, `settings.defaults.${path}`, val);
    console.log('set', lget(person, `settings.defaults.${path}`));
    await person.save()
      .then(() => Notify.create({ message: 'Default Set', color: 'positive' }))
      .catch(err => Notify.create({ message: err.message, color: 'negative', timeout: 20000 }));
  };
  Vue.prototype.$rmvProfileItem = async (person, i, item, text) => {
    let label = text ? text : item;
    if (person[item].length > 1) {
      person[item].splice(i, 1);
      await person.save()
        .then(() => {
          Notify.create({ message: `${label} Saved`, color: 'positive' });
        })
        .catch(err => Notify.create({message: err.message, color: 'negative', timeout: 20000 }));
    } else Dialog.create({ message: `Your profile must have at least one ${label}. You must add a new email before removing this one` });
  };
};
