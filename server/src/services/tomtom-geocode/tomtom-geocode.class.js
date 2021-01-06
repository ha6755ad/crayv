const axios = require('axios');

const apiClient = axios.create({
  baseURL: 'https://api.tomtom.com',
  withCredentials: false, // This is the default
  // headers: {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json'
  // }
});

const key = process.env.TOMTOM_API_KEY;

/* eslint-disable no-unused-vars */
exports.TomtomGeocode = class TomtomGeocode {
  constructor (options) {
    this.options = options || {};
  }

  async find (params) {
    let queryParams = {
      key: key,
      language: 'en-US',
      limit: 10,
      countrySet: 'US',
      typeahead: true,
    };
    return await apiClient.get('/search/2/geocode/' + encodeURI(params.query.text) + '.json',{'params': queryParams})
      .then(res => {
        // console.log('tomtom res', res.data);
        return res.data;
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error('geocode error', err.errno);
        return err;
      });
  }

  // async get (id, params) {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }

  async create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
  }

  // async update (id, data, params) {
  //   return data;
  // }

  // async patch (id, data, params) {
  //   return data;
  // }
  //
  // async remove (id, params) {
  //   return { id };
  // }
};
