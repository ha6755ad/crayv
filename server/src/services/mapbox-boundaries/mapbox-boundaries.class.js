const lget = require('lodash.get');

// Tileset ID	Description
// mapbox.enterprise-boundaries-a0-v2	States or territories that have ISO 3166-1 codes, plus Kosovo
// mapbox.enterprise-boundaries-a1-v2	First-level administrative areas
// mapbox.enterprise-boundaries-a2-v2	Second-level administrative areas
// mapbox.enterprise-boundaries-a3-v2	Third-level administrative areas
// mapbox.enterprise-boundaries-a4-v2	Fourth-level administrative areas
// mapbox.enterprise-boundaries-a5-v2	Fifth-level administrative areas
// mapbox.enterprise-boundaries-aL-v2	Administrative division lines for all levels
// mapbox.enterprise-boundaries-p1-v2	Postal code grouping areas
// mapbox.enterprise-boundaries-p2-v2	Postal code grouping areas
// mapbox.enterprise-boundaries-p3-v2	Postal code grouping areas
// mapbox.enterprise-boundaries-p4-v2	Full-detail postal code areas
// mapbox.enterprise-boundaries-s1-v2	First-level statistical areas
// mapbox.enterprise-boundaries-s2-v2	Second-level statistical areas
// mapbox.enterprise-boundaries-s3-v2	Third-level statistical areas
// mapbox.enterprise-boundaries-s4-v2	Fourth-level statistical areas/* eslint-disable no-unused-vars */

const getLayerName = val => {
  switch(val){
    case('country'): return 'mapbox.enterprise-boundaries-a0-v2';
    case('state'): return 'mapbox.enterprise-boundaries-a1-v2';
    case('county'): return 'mapbox.enterprise-boundaries-a2-v2';
    case('city'): return 'mapbox.enterprise-boundaries-a4-v2';
    case('postal'): return 'mapbox.enterprise-boundaries-p4-v2';
  }
};

const axios = require('axios');
const apiClient = axios.create({
  baseURL: 'https://api.mapbox.com/v4',
  withCredentials: false, // This is the default
  // headers: {
  //   'Accept': 'application/json',
  //   'Content-Type': 'application/json'
  // }
});

exports.MapboxBoundaries = class MapboxBoundaries {
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
    // https://api.mapbox.com/v4/mapbox.enterprise-boundaries-a2-v2/tilequery/12.87,43.100.json?access_token=YOUR_MAPBOX_ACCESS_TOKEN
    let path = getLayerName(lget(data, 'layer', 'postal'));
    let lng = 12.87;
    let lat = 43.100;

    return await apiClient.get(`/${path}/tilequery/${lng},${lat}.json`, {params: { access_token: process.env.MAPBOX_API_KEY }})
      .then(res => {
        console.log('mapbox boundary response', res);
      })
      .catch(err => {
        console.log('mapbox boundary error', err);
      });
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
