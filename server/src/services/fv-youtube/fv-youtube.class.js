let key = process.env.GOOGLE_API_KEY;
let axios = require('axios');

/* eslint-disable no-unused-vars */
exports.FvYoutube = class FvYoutube {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  async get(id, params) {

    let videoId = id;
    let video = await axios({
      method: 'get',
      url: `https://www.googleapis.com/youtube/v3/videos?part=snippet&key=${key}&id=${videoId}`,
      headers: {
        Accept: 'application/json',
        ContentType: 'application/json'
      }
    })
      .then(res => {
        console.log('video res', res.data.items);
        return res.data.items[0].snippet;
      }).catch(err => {
        console.log('error gettin youtube video', err, 'key', key);
      });
    return video;
  }

  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    return data;
  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  async remove(id, params) {
    return { id };
  }
};
