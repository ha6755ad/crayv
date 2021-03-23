<template>
  <div id="markerExample">
    <google :infoBoxes="markers"></google>
  </div>

</template>

<script>
  import google from '../google';

  export default {
    name: 'infoWindowExample',
    components: {
      google
    },
    data() {
      return {
        markers: [
          {
            position:
              {'lat': 40.4214524, 'lng': -111.8910387}
          },
          {
            position:
              {'lat': 40.4214524, 'lng': -111.8910387},
          },
          {
            position:
              {'lat': 40.4214524, 'lng': -111.8910387},
          },
          {
            position:
              {'lat': 40.4168552, 'lng': -111.8781979},
          },
          {
            position:
              {'lat': 40.4194142, 'lng': -111.8762036},
          },
          {
            position:
              {'lat': 40.4136003, 'lng': -111.8926302},
          },
          {
            position:
              {'lat': 40.4279757, 'lng': -111.8809573},
          },
          {
            position:
              {'lat': 40.4307851, 'lng': -111.8800131},
          },
          {
            position:
              {'lat': 40.4369589, 'lng': -111.8929307},
          },
          {
            position:
              {'lat': 40.435489, 'lng': -111.9045178},
          },
          {
            position:
              {'lat': 40.4298227, 'lng': -111.9088413},
          },
          {
            position:
              {'lat': 40.4231392, 'lng': -111.9049674},
          },
          {
            position:
              {'lat': 40.4259036, 'lng': -111.9018078}
          },
        ]
      };
    },
    computed: {}
  };
</script>

<style scoped lang="scss">
  #markerExample {
    // Vars

    // Support

    // Module
    & {
      //
    }

    // Facets

    // States
    height: 100vh;
    width: 100%;
  }
</style>
