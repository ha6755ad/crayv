import Vue from 'vue';

const lget = require('lodash.get');
const lset = require('lodash.set');
import {Notify, Dialog} from 'quasar';

const localUuid = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
};

export default async () => {
  Vue.prototype.$setPhone = (number, isValid, path) => {
    return path ? lget(number.isValid, 'path') : isValid;
  };

  Vue.prototype.$tomtomToAddress = async (address) => {
    let addressObj = {
      uuid: localUuid(),
      formatted: lget(address, 'address.freeformAddress', null),
      address1: lget(address, 'address.streetNumber', '') + ' ' + lget(address, 'address.streetName', ''),
      region: lget(address, 'address.countrySubdivision', ''),
      city: lget(address, 'address.countrySecondarySubdivision', ''),
      postal: lget(address, 'address.postalCode', ''),
      country: lget(address, 'address.country', ''),
      latitude: Number(address.position.split(',')[0]),
      longitude: Number(address.position.split(',')[1]),
      tomtomAddress: address.address
    };
    return addressObj;
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
