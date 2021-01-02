const axios = require('axios');
const lget = require('lodash.get');

let key = 'efb581eabb3be870e92628fc08ef78bb';

/* eslint-disable no-unused-vars */
exports.CurrencyExchange = class CurrencyExchange {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    return [];
  }

  async get (id, params) {
    return {
      id, text: `A new message with ID: ${id}!`
    };
  }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }

    console.log('hitting exchange', data);

    // let str = ''
    // let symbols = lget(data, 'symbols', []);
    // symbols.forEach((symbol, i) => {
    //   str += symbol.toUpperCase() + i < symbols.length - 1 ? ',' : '';
    // })

    let currency = data.base.toUpperCase();

    let res = await axios({
      method: 'post',
      url: 'http://api.currencylayer.com/live',
      params: {
        access_key: key,
        source: currency,
      }
    })
      .then(res => {
        console.log('currency api res', res);
        return {
          source: currency,
          data: lget(res, 'data.quotes')
        };
      }).catch(err => {
        console.log('currency err', err);
        return err;
      });

    console.log('currency res', res);
    return res;

  }

  async update (id, data, params) {
    return data;
  }

  async patch (id, data, params) {
    return data;
  }

  async remove (id, params) {
    return { id };
  }
};
