const lget = require('lodash.get');
// const lset = require('lodash.set');
/* eslint-disable no-unused-vars */
exports.BoundaryFilter = class BoundaryFilter {
  constructor (options) {
    this.options = options || {};
  }

  setup(app){
    this.app = app;
  }

  async find (params) {
    let service = lget(params, '$boundaryParams.service');
    let geo = lget(params, '$boundaryParams.geo');
    let geoField = lget(params, '$boundaryParams.geoField');
    let query = lget(params, 'query', {});
    // geo should be like
    // geometry: {
    //   type: 'Polygon',
    //     coordinates: [[lng,lat]]
    // }
    if(geoField) {
      query[`${geoField}.features.geometry`] = {
        $geoIntersects: {
          $geometry: geo
        }
      };
    }
    console.log('boundary filter', query, service);
    return await this.app.service(service).find({query: query})
      .then(res => {
        console.log('boundary filter res', res);
        return res;
      })
      .catch(err => {
        throw new Error('boundary filter err ' + err.message)
      });
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

    return data;
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
