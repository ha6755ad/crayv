<template>
  <div>
    <div class="row justify-center">
      <div :style="{'border-radius': '2px', 'box-shadow': '0 0 3px rgba(0,0,0,.4)', position: 'relative', height: height, width: width}">

        <q-btn push size="sm" class="t-r bg-background text-primary" dense icon="mdi-download" @click="downloadFile(file)"/>

        <iframe :src="$getFile(file)" :height="height" :width="width" frameborder="0"></iframe>
      </div>
    </div>
    <div v-if="nameOn" class="row justify-center" :style="{width: width}">
      <div :class="textClass ? textClass : 'text-xxxs text-mb-xxs'">{{ file.name }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'FilePreview',
    props: {
      download: {
        type: Boolean,
        default: true
      },
      nameOn: Boolean,
      textClass: String,
      file: Object,
      height: {
        type: String,
        default: '150px'
      },
      width: {
        type: String,
        default: '120px'
      }
    },
    methods: {
      downloadFile(file){
        window.open(this.$getFile(file), '_blank');
      }
    }
  };
</script>
