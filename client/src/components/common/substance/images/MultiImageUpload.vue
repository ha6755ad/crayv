<template>
  <q-card :style="{height: height, width: width}">
    <q-img style="height: 100%; width: 100%" :src="getAvatar(value, null, 'large', idx)">
      <q-btn color="white" round flat size="sm" class="t-r" icon="mdi-delete" @click.stop="removeImage" v-if="value && value.length > 1">
        <q-tooltip content-class="bg-light text-dark">Remove Image</q-tooltip>
      </q-btn>
      <q-btn v-if="value && value.length > 1"
             style="position: absolute; top: 50%; left: 3px; transform: translate(0, -50%)" round flat
             icon="mdi-chevron-left"/>
      <q-btn v-if="value && value.length > 1"
             style="position: absolute; top: 50%; right: 3px; transform: translate(0, -50%)" round flat
             icon="mdi-chevron-right"/>
      <div style="height: 100%; width: 100%" class="flex flex-center">
        <q-slide-transition>
          <template v-if="!adding">
            <q-btn @click.stop="adding = true" color="white" flat icon="mdi-image" :label="addLabel"/>
          </template>
        </q-slide-transition>
        <q-slide-transition>
          <template v-if="adding">
            <image-uploader
              storage="s3"
              label-off
              name="value"
              :value="value"
              @input="addImage"
              :attrs="{imageTransformVariantsOriginalName: 'large'}"
            />
          </template>
        </q-slide-transition>
      </div>
    </q-img>
  </q-card>
</template>

<script>

  import ImageUploader from 'components/common/substance/images/ImageUploader';
  export default {
    name: 'MultiImageUpload',
    components: { ImageUploader },
    props: {
      addLabel: {
        type: String,
        default: 'Add Images'
      },
      value: Array,
      height: {
        type: String,
        default: '220px'
      },
      width: {
        type: String,
        default: '220px'
      }
    },
    data() {
      return {
        adding: false,
        idx: 0
      };
    },
    methods: {
      removeImage() {
        let list = this.value;
        list.splice(this.idx, 1);
        this.$emit('input', list);
      },
      addImage(img) {
        console.log('adding image', img);
        let list = this.value;
        list ? list.push(img) : list = [img];
        console.log('emitting image', list);
        this.$emit('input', list);
        this.adding = false;
      }
    }
  };
</script>
