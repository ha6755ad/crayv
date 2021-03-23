<template>
  <q-card dark :style="{height: size, width: size, borderRadius: '8px'}">
    <q-img style="height: 100%; width: 100%; background: #eeeeee" :src="useImg">
      <q-btn color="white" round flat size="sm" class="t-r" icon="mdi-delete" @click.stop="removeItem(idx, value[idx])"  v-if="Array.isArray(value) && value.length > 1">
        <q-tooltip content-class="bg-light text-dark">Remove Image</q-tooltip>
      </q-btn>
      <q-btn class="b-r bg-white text-green" size="sm" dense push icon="mdi-check" @click="reset" v-if="added && adding">
        <q-tooltip>Done Editing</q-tooltip>
      </q-btn>
      <q-btn  v-if="Array.isArray(value) && value.length > 1"
              style="position: absolute; top: 50%; left: 3px; transform: translate(0, -50%)" round flat
              icon="mdi-chevron-left" @click.stop="idx > 0 ? idx-- : idx = value.length - 1"/>
      <q-btn v-if="Array.isArray(value) && value.length > 1"
             style="position: absolute; top: 50%; right: 3px; transform: translate(0, -50%)" round flat
             icon="mdi-chevron-right"
             @click.stop="idx < value.length - 1 ? idx++ : idx = 0"/>
      <q-btn
        dense
        @click.stop="adding = !adding"
        class="bg-shade-2 text-white t-l-a"
        flat
        :label="adding ? null : '+'" :icon="adding ? 'mdi-close' : 'mdi-image'"/>
      <div style="height: 100%; width: 100%" class="flex flex-center" v-show="adding">
        <q-slide-transition>
          <template v-if="adding || !value">
            <image-uploader
              storage="s3"
              label-off
              name="value"
              :value="null"
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
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import ImageUploader from 'components/common/substance/images/ImageUploader';

  export default {
    name: 'ImageForm',
    components: { ImageUploader },
    mixins: [SelectMixin],
    props: {
      multiple: Boolean,
      emitValue: Boolean,
      optionValue: String,
      size: { type: String, default: '200px' },
      value: { required: false }
    },
    data() {
      return {
        idx: 0,
        adding: false,
        added: false,
        show: false
      };
    },
    computed: {
      useImg(){
        let img = this.getAvatar(this.value, null, 'medium', this.multiple ? this.idx : null, this.value);
        return img ? img : this.value;
      }
    },
    methods: {
      reset(){
        this.adding = false;
        this.added = false;
      },
      addImage(val){
        this.show = false;
        console.log('adding image', val);
        this.added = true;
        this.handleInput(val);
      }
    }
  };
</script>

<style scoped>

</style>
