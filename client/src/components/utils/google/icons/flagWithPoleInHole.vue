<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 512 512">
    <defs/>
    <path d="M496 144c-65.781 24.219-115.906 41.469-160 96-39.281 48.594-96 65.438-160 33.406V448h-32V16c0-8.844 7.156-16 16-16s16 7.156 16 16c35.531 51.656 97.281 63.094 160 64 96 1.406 160 64 160 64zM208 356.25v32.563c37.75 7.719 64 24.094 64 43.188 0 26.5-50.156 48-112 48S48 458.5 48 432c0-19.094 26.25-35.469 64-43.188V356.25C53.875 366.313 16 394.5 16 432c0 47.094 59.219 80 144 80s144-32.906 144-80c0-37.5-37.875-65.687-96-75.75z"/>
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
