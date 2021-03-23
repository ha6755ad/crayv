<template>
  <div></div>
</template>

<script>
  export default {
    name: 'puzzleExample',
    // inject: ["google", "map"],
    props: {
      google: {
        type: Object,
        required: true
      },
      map: {
        type: Object,
        required: true
      },
      positions: {
        type: Array,
        required: true
      },
      config: {
        type: Object,
        required: false
      }
    },
    data(){
      return { marker: null};
    },
    mounted(){
      const { Polyline } = this.google.maps;
      const overrideConfig = query => ({
        ...query.icon && { icon: location.icon },
        ...query.shape && { shape: location.shape },
        ...query.title && { title: location.title },
        ...query.label && { label: location.label },
      });
      this.polyline = new Polyline({
        path: this.positions.map(a => a.position),
        map: this.map,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2,
        title: 'PolyLine!',
        ...this.config,
        ...overrideConfig

      });
    }
  };
</script>
