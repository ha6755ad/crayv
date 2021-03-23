/* eslint-disable no-unused-vars */
const axios = require('axios');
// const mime = require('mime-types');

// TILE API
// const getPower = axios.create({
//   baseURL: 'https://api.nearmap.com',
//   withCredientials: false,
// });

const apiKey = process.env.NEARMAP_API_KEY;

const apiClient = axios.create({
  baseURL: 'https://api.nearmap.com',
  withCredentials: false // This is the default
});

// IMAGE API

/* eslint-disable no-unused-vars */
exports.NearmapTile = class Nearmap {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const type = params.type;
    const z = params.z;
    const x = params.x;
    const y = params.y;
    const obj = {
      apiKey: apiKey,
      tertiary: 'satellite',
      since: '2015-01-01'
    };

    return await apiClient.get(`/tiles/v3/${type}/${z}/${x}/${y}.jpg` + '?', {params: obj})
      .then(response => {
        return [response];
        // let extension = mime.extension(response.headers['content-type']);
        // return [{'arraybuffer': response.data, 'content-type': response.headers['content-type'], 'extension': extension}];
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('nearmap fetch error', error.message);
        return error.response.data;
      });
  }

  // TILE API
  // Type: 'Vert',
  // // Vert, North, South, East, West
  // z: 21,
  // x: 1,
  // y: 1,
  // format: 'img',
  // tertiary: 'satellite',
  // tileCoordinate: 0,0

  // TILE API RESTRICTED
  // async find (params) {
  //   console.log('getting map', params.query, key);
  //   let p = params.query;
  //   return await getPower.get('/tiles/v3/' + p.Type + '/' + p.z + '/' + p.tileCoordinate.x + '/' + p.tileCoordinate.y + '.' + p.format, {'params': {tertiary: params.query.tertiary, apikey: key}})
  //     .then(response => {
  //       //console.log('orders: response: ' + response);
  //       console.log('got a map', typeof response.data)
  //       return [response.config.url];
  //     })
  //     .catch(error => {
  //       //console.log('orders: error: ' + error);
  //       console.log('error getting map')
  //       return error.response.data;
  //     });
  // }

  //

  // async remove (id, params) {async get (id, params) {
  //   return {
  //     id, text: `A new message with ID: ${id}!`
  //   };
  // }
  //
  // async create (data, params) {
  //   if (Array.isArray(data)) {
  //     return Promise.all(data.map(current => this.create(current, params)));
  //   }
  //
  //   return data;
  // }
  //
  // async update (id, data, params) {
  //   return data;
  // }
  //
  // async patch (id, data, params) {
  //   return data;
  // }
  // return { id };
  // }
};
