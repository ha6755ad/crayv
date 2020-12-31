import Vue from 'vue';
const lget = require('lodash.get');

export default async () => {
  Vue.prototype.$getStripeAddressObj = (person) => {
    let personAddress = lget(person, 'addresses[0]', null);
    if(personAddress) {
      let address_obj = {
        line1: lget(person, 'addresses[0].address1', null),
        city: lget(person, 'addresses[0].city', null),
        country: lget(person, 'addresses[0].country', '').toLowerCase().indexOf('states') > -1 ? 'US' : null,
        postal_code: lget(person, 'addresses[0].postal', null),
        state: lget(person, 'addresses[0].region', null)
      };
      let test = 0;
      let keyList = Object.keys(address_obj);
      keyList.forEach(a => {
        if(address_obj[a] && typeof address_obj[a] !== 'undefined'){
          test++;
        }
      });
      if(test === keyList.length) return address_obj;
      else return null;
    } else return null;
  };
};
