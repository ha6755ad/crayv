<template>
  <q-card :style="{height: height, width: width}">
    <q-img style="height: 100%; width: 100%" :src="getAvatar(value, null, 'large')">
      <div style="height: 100%; width: 100%" class="flex flex-center">
    <q-slide-transition>
      <template v-if="adding">
        <image-uploader name="value" :value="value" @input="handleImage"/>
<!--        <form-generator @remove="removeImage" @input="handleImage" :value="imgResult" :fields="fields"></form-generator>-->
      </template>
    </q-slide-transition>
    <q-slide-transition>
      <template v-if="!adding">
        <q-btn :label="addLabel" flat icon="mdi-image" color="white" @click="adding = true"/>
      </template>
    </q-slide-transition>
      </div>
    </q-img>
  </q-card>
</template>
<script>

  import ImageUploader from './ImageUploader';
  export default {
    components: { ImageUploader },
    props: {
      addLabel: {
        type: String,
        default: 'Add Logo'
      },
      height: {
        type: String,
        default: '220px'
      },
      width: {
        type: String,
        default: '220px'
      },
      value: Object
    },
    mounted(){
      if(this.getAvatar(this.value, null, 'large')){
        this.adding = false;
      }
    },
    data(){
      return {
        imgResult: null,
        adding: false,
        fields: [
          {
            fieldType: 'ImageSelect',
            path: 'avatar',
            storage: 's3',
            'label-attrs': {
              'v-text': 'Host Avatar',
              'style': { 'font-size': '20px' }
            }
          },
        ]
      };
    },
    methods: {
      removeImage(){
        this.imgResult = null;
        this.$emit('input', null);
      },
      handleImage(val){
        this.imgResult = val;
        console.log('handling image', val);
        let payload = val;
        if(Array.isArray(val)) payload = val[0];
        console.log('emitting input', payload);
        this.$emit('input', payload);
        this.adding = false;
      }
    }
  };
</script>
