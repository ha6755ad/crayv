<template>
  <q-card flat :style="styleIn" @click="$emit('input', value)" class="fill_size">
    <multi-image-viewer
      avatar-path="images"
      :value="value"
    >
      <template v-slot:content>
      <div class="absolute-bottom" style="width: 100%;">
        <div class="q-pa-sm">
          <div :class="titleClass">{{lget(value, 'name')}}
            <q-tooltip>{{lget(value, 'name')}}</q-tooltip>
          </div>
          <div :class="descriptionClass" style="line-height: 1.2">
            <v-clamp :max-lines="descriptionLines" :autoresize="true">{{lget(value, 'description')}}</v-clamp>
          </div>
        </div>
      </div>
      </template>
    </multi-image-viewer>
  </q-card>
</template>

<script>
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import VClamp from 'vue-clamp';

  export default {
    name: 'ProductVariantCard',
    components: { MultiImageViewer, VClamp },
    props: {
      value: Object,
      styleIn: [String, Object],
      titleClass: {
        type: String,
        default: 'text-xs text-mb-sm text-weight-medium __one-liner'
      },
      descriptionClass: {
        type: String,
        default: 'text-xxs text-mb-xs text-weight-light'
      },
      descriptionLines: {
        type: Number,
        default: 2
      }
    }
  };
</script>
