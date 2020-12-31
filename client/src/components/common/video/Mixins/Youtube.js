import axios from 'axios';

export const Youtube = {
  methods: {
    getYoutubeVideo(videoID) {
      return axios({
        method: 'get',
        url: 'https://www.googleapis.com/youtube/v3/videos?part=snippet&key=AIzaSyD_EJ7qsuOvKCFFWpx2isY1lQxNNsM9WFc&id=' + videoID,
        headers: {
          Accept: 'application/json',
          ContentType: 'application/json'
        }
      });
    }
  }
};
