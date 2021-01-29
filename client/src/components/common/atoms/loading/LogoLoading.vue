<template>
  <div class="flex flex-center text-center" style="height: 100%; width: 100%">
    <div class="float">
      <img :style="{ height: size ? size : '120px' }" :src="img">
      <div class="row justify-center">
        <q-spinner-dots color="accent" size="90px"></q-spinner-dots>
      </div>
      <div class="text-center text-md text-mb-md text-weight-medium">{{text}}</div>
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
  @keyframes float {
    0% {
      transform: translatey(0px);
    }
    50% {
      transform: translatey(-20px);
    }
    100% {
      transform: translatey(0px);
    }
  }

  .float {
    transform: translatey(0px);
    animation: float 4s ease-in-out infinite;
  }
</style>

