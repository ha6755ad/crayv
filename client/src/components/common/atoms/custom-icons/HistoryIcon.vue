<template>
  <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 514.03 481.47">
    <defs>
      <linearGradient id="HistoryGradient" gradientTransform="rotate(66)">
        <stop offset="33%" :stop-color="color1"></stop>
        <stop offset="66%" :stop-color="color2"></stop>
        <stop offset="85%" :stop-color="color3"></stop>
        <stop offset="100%" :stop-color="color4"></stop>
      </linearGradient>
    </defs>
    <path class="cls-1" d="M809.58,727.69c-13.41-11.32-27.19-22.2-40.81-33.28q-30.1-24.48-60.22-49a13.51,13.51,0,0,0-16.88-.59c-1.61,1.19-2.46.9-3.75-.32-5.74-5.43-11.52-10.83-17.4-16.13-1.56-1.42-1.74-2.41-.61-4.31,18-30.16,26.82-62.86,27-98.1a192.45,192.45,0,0,0-10.74-62.78A189.41,189.41,0,0,0,622,374.54c-30-23-63.89-36.23-101.67-39.15A188.06,188.06,0,0,0,430.56,350,190.88,190.88,0,0,0,313.85,537.72a19,19,0,0,0,1.27,5.83,20.06,20.06,0,0,0,23,12.44c9.86-2.11,16.38-11.09,15.77-21.62-1.53-26.17,3.29-51.19,15.22-74.47,24-46.85,62.07-74.91,114.19-83.42a142.35,142.35,0,0,1,51.93,1.28,148.83,148.83,0,0,1,72,36.67q41.84,38.46,48.64,95a145.23,145.23,0,0,1-3.81,54.5,149.86,149.86,0,0,1-52.16,80.73,147.57,147.57,0,0,1-79.17,32.49,149.21,149.21,0,0,1-50.85-3.3c-10.77-2.62-22,3.84-24.38,14.08-2.73,11.57,3.66,22.3,14.89,24.91a194.62,194.62,0,0,0,59,4.67A190.33,190.33,0,0,0,637.7,664.6c1.45-1.4,2.31-1.51,3.8-.08,4.66,4.52,9.44,8.92,14.24,13.3,1.06,1,1.26,1.58.27,2.83-4.72,5.94-4.58,12.55.31,18.44q13.54,16.32,27.15,32.6,27.63,33.18,55.24,66.39c13,15.73,35,22.28,54.42,15.55,18.71-6.5,30.33-19.75,33.62-39.24C829.87,755.88,824.06,739.91,809.58,727.69Z" transform="translate(-313.54 -334.78)"/><path class="cls-1" d="M524.36,502.54a3.76,3.76,0,0,1-1.76-2.81c-.5-9.56-1.08-19.12-1.65-28.68-.65-10.8-1.22-21.61-2-32.4-.53-7.36-5.59-12.78-12-13.25-7.62-.57-13.55,3.5-15,10.88-.78,3.89-.69,8-.93,11.93-1,16.79-2,33.58-3,50.37a5.39,5.39,0,0,1-2.13,4.23,29.2,29.2,0,0,0-10.88,19.84C473,543,489.75,559,510.08,556.21a4,4,0,0,1,3.43.87Q530.2,571,547,584.74a13.15,13.15,0,0,0,7.18,3.23c6.26.59,11.43-2.19,14-7.44s1.69-10.92-2.52-15.68c-9.11-10.28-18.13-20.64-27.29-30.87-2-2.21-3.78-4.25-2.7-7C535.68,516.74,531.85,508.77,524.36,502.54Z" transform="translate(-313.54 -334.78)"/><path class="cls-1" d="M403.2,643.62a20.7,20.7,0,1,0,20.49,20.78A20.68,20.68,0,0,0,403.2,643.62Z" transform="translate(-313.54 -334.78)"/><path class="cls-1" d="M353.84,587a20.64,20.64,0,1,0,20.78,20.62A20.43,20.43,0,0,0,353.84,587Z" transform="translate(-313.54 -334.78)"/>
  </svg>
</template>

<script>
  export default {
    name: 'HistoryIcon',
    props: {
      color1: {type: String, default: 'var(--q-color-primary)'},
      color2: {type: String, default: 'var(--q-color-primary)'},
      color3: {type: String, default: 'var(--q-color-secondary)'},
      color4: {type: String, default: 'var(--q-color-secondary)'},
    }
  };
</script>

<style scoped lang="scss">
  .cls-1 {
    fill: url(#HistoryGradient) black;
  }
</style>
