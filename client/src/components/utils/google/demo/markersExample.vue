<template>
  <div id="markersExample">
    <google :markers="markers" :markClusters="true"></google>
  </div>

</template>

<script>
  import google from '../google';

  export default {
    name: 'markersExample',
    components: {
      google
    },
    data() {
      return {
        markers: [
          {
            position:
              {'lat': 40.4254524, 'lng': -111.9010387},
            label: 'Visa',
            title: 'Visa'
          },
          {
            position:
              {'lat': 40.4234524, 'lng': -111.8910387},
            label: 'Vivint Solar'
          },
          {
            position:
              {'lat': 40.4214524, 'lng': -111.8920387},
            label: 'Podium'
          },
          {
            position:
              {'lat': 40.4168552, 'lng': -111.8781979},
            label: 'Hilton Garden'
          },
          {
            position:
              {'lat': 40.4194142, 'lng': -111.8762036},
            label: 'Oracle Lehi'
          },
          {
            position:
              {'lat': 40.4136003, 'lng': -111.8926302},
            label: 'Adobe'
          },
          {
            position:
              {'lat': 40.4279757, 'lng': -111.8809573},
            label: 'New Hope'
          },
          {
            position:
              {'lat': 40.4307851, 'lng': -111.8800131},
            label: 'Thanksgiving Point Golf Course'
          },
          {
            position:
              {'lat': 40.4369589, 'lng': -111.8929307},
            label: 'Crandall Embroidery'
          },
          {
            position:
              {'lat': 40.435489, 'lng': -111.9045178},
            label: 'Maverick'
          },
          {
            position:
              {'lat': 40.4298227, 'lng': -111.9088413},
            label: 'Preschool Point Meadow'
          },
          {
            position:
              {'lat': 40.4231392, 'lng': -111.9049674},
            label: 'Utah College of Applied Technology'
          },
          {
            position:
              {'lat': 40.4259036, 'lng': -111.9018078},
            label: 'Visa'
          },
        ]
      };
    },
    computed: {}
  };
</script>

<style scoped lang="scss">
  #markersExample {
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
