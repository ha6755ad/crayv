<template>
  <div class="flex flex-center text-center" style="height: 100%; width: 100%">
    <div>
      <img style="transform: rotate(-90deg)" class="__logo_loading_img" :style="{ height: size ? size : '120px' }" :src="img">
      <div class="text-md text-mb-md text-weight-medium">{{text}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'LogoLoading',
    props: {
      img: String,
      size: String,
      text: String
    }
  };
</script>

<style scoped lang="scss">
  .__logo_loading_img {
    -webkit-animation: flip-scale-up-diag-2 .5s linear both;
    animation: flip-scale-up-diag-2 .5s linear both;

  }


  @-webkit-keyframes flip-scale-up-diag-2 {
    0% {
      -webkit-transform: scale(1) rotate3d(-1, 1, 0, 0deg);
      transform: scale(1) rotate3d(-1, 1, 0, 0deg)
    }
    50% {
      -webkit-transform: scale(2.5) rotate3d(-1, 1, 0, 90deg);
      transform: scale(2.5) rotate3d(-1, 1, 0, 90deg)
    }
    100% {
      -webkit-transform: scale(1) rotate3d(-1, 1, 0, 180deg);
      transform: scale(1) rotate3d(-1, 1, 0, 180deg)
    }
  }

  @keyframes flip-scale-up-diag-2 {
    0% {
      -webkit-transform: scale(1) rotate3d(-1, 1, 0, 0deg);
      transform: scale(1) rotate3d(-1, 1, 0, 0deg)
    }
    50% {
      -webkit-transform: scale(2.5) rotate3d(-1, 1, 0, 90deg);
      transform: scale(2.5) rotate3d(-1, 1, 0, 90deg)
    }
    100% {
      -webkit-transform: scale(1) rotate3d(-1, 1, 0, 180deg);
      transform: scale(1) rotate3d(-1, 1, 0, 180deg)
    }
  }
</style>
