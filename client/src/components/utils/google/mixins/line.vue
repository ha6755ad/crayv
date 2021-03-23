<script>
/* eslint-disable no-unused-vars */

  import { LINE_PATH_CONFIG } from '@/constants/mapSettings';

  export default {
    props: {
      google: {
        type: Object,
        required: true
      },
      map: {
        type: Object,
        required: true
      },
      path: {
        type: Array,
        required: true
      }
    },

    mounted() {
      const { Polyline } = this.google.maps;
      let poly = new Polyline({
        // path: this.path,
        map: this.map,
        ...LINE_PATH_CONFIG
      });
      let event = this.map.addListener('click', addLatLng);
      function addLatLng(event) {
        let path = poly.getPath();
        path.push(event.latLng);

        // eslint-disable-next-line no-undef
        var marker = new google.maps.Marker({
          position: event.latLng,
          title: '#' + path.getLength(),
          map: this.map
        });}
    },



    // eslint-disable-next-line vue/require-render-return
    render() {},
  };
</script>
