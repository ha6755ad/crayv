<template>
  <q-card :flat="flat">
    <div :class="`${flex ? 'flex items-center justify-center' : ''} text-${size} text-mb-${size} text-weight-medium`" style="width: 100%;">
      <div style="cursor:pointer">
        {{ value }}{{uom}}
        <q-menu>
          <q-list>
            <q-item v-for="i in 10" :key="`level-${i}`" clickable @click="setKm(i * 10)">
              <q-item-section>
                <q-item-label class="text-center text-xs text-mb-xs text-weight-bold">{{ i * 10 }}{{uom}}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
      <q-icon name="mdi-menu-down"></q-icon>
      <q-icon class="q-mx-sm" color="nice" name="mdi-map-marker-radius" size="20px"></q-icon>
      <div style="cursor: pointer" @click="changing = !changing">
        {{ $limitStr(lget(address, 'city', 'Getting Location...'), textLimit) }}
      </div>
      <q-icon name="mdi-menu-down"></q-icon>
    </div>

    <template v-if="behavior === 'slide'">
      <q-slide-transition>
        <template v-if="changing">
          <boundary-tabs
            @input="setKm"
            :value="value / factor"
            :factor="factor"
            :color="color"
          ></boundary-tabs>
        </template>
      </q-slide-transition>
    </template>
    <template v-if="behavior === 'dialog'">
      <q-dialog v-model="changing" transition-show="slide-up" transition-hide="slide-down">
        <q-card style="border-radius: 10px; width: 600px; max-width: 100vw; min-height: 250px">
          <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="changing = false"/>
          <boundary-tabs
            @input="setKm"
            :value="value / factor"
            :factor="factor"
            :color="color"
          ></boundary-tabs>
        </q-card>
      </q-dialog>
    </template>

  </q-card>
</template>

<script>
  import {LocationMixin} from 'src/mixins/LocationMixin';
  import BoundaryTabs from 'components/common/atoms/filters/BoundaryTabs';

  export default {
    name: 'BoundaryFilter',
    mixins: [LocationMixin],
    components: { BoundaryTabs },
    props: {
      uom: { type: String, default: 'km' },
      factor: { type: Number, default: 1 },
      size: { type: String, default: 'xs' },
      behavior: { type: String, default: 'dialog' },
      flex: Boolean,
      flat: Boolean,
      textLimit: { type: Number, default: 40 },
      value: { type: Number, default: 40 },
      color: String,
      padding: { type: String, default: 'sm' }
    },
    data() {
      return {
        noLocationCheck: true,
        changing: false,
        tab: 0,
        estimateAddress: true,
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          console.log('see change', newVal);
          if(newVal) this.$emit('input', newVal);
        }
      }
    },
    computed: {
      defaultAddress() {
        return this.lget(this.user, 'addresses[0]');
      },
      locationText() {
        return this.lget(this.value, 'formatted');
      }
    },
    methods: {
      setKm(val) {
        this.$emit('input', val);
      }
    }
  };
</script>

<style scoped lang="scss">
  .__boundary_btn {
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 0, 0, .15);
  }

  .__boundary_menu {
    transition: all .3s ease-out;
    height: auto;
  }


</style>
