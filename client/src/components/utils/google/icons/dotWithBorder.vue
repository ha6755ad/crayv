<template>
  <svg
      width="28"
      height="28"
      viewBox="0 0 28 28">
    <defs>
      <circle id="my-location-a" cx="14" cy="14" r="8" />
    </defs>
    <g fill="none" fill-rule="evenodd">
      <use :fill="fillColor" xlink:href="#my-location-a"/>
      <circle cx="14" cy="14" r="11" :stroke="strokeColor" stroke-opacity="0.3" stroke-width="6" />
      <circle cx="14" cy="14" r="7" stroke="#FFF" stroke-linejoin="square" stroke-width="2" />
    </g>
  </svg>
</template>

<script>
  export default {
    name: 'markDynamic',
    props: {
      fillColor: {
        type: String
      },
      strokeColor: {
        type: String
      }
    }
  };
</script>
