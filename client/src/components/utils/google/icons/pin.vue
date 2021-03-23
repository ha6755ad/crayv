<template>
  <svg
      version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
      y="0px"
      width="24"
      height="24"
      viewBox="0 0 512 512"
      enable-background="new 0 0 512 512"
      xml:space="preserve">
    <path d="M288,448l-64,64V288h64V448z M132.531,256h246.938C370.813,222.563,349,194.531,320,177.531V64c17.688,0,32-14.313,32-32 S337.688,0,320,0H192c-17.688,0-32,14.313-32,32s14.313,32,32,32v113.531C163,194.531,141.188,222.563,132.531,256z"/>
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
