<template>
  <svg
      width="22"
      height="22"
      viewBox="0 0 28 28">
    <defs>
      <circle id="my-location-a" cx="14" cy="14" r="8" />
    </defs>
    <g fill="none" fill-rule="evenodd">
      <use fill="#666666" xlink:href="#my-location-a"/>
      <circle cx="12" cy="12" r="11" stroke="#666666" stroke-opacity="0.3" stroke-width="3" />
      <circle cx="12" cy="12" r="7" stroke="#FFF" stroke-linejoin="square" stroke-width="1" />
    </g>
  </svg>
</template>

<script>
  export default {
    name: 'mark'
  };
</script>
