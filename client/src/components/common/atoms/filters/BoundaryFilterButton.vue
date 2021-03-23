<template>
  <q-btn icon="mdi-map-marker-radius" v-bind="btnProps" icon-right="mdi-menu-down">
    <div class="q-mx-xs text-xxs text-mb-xxs text-weight-bold text-uppercase">{{ locationText ? $limitStr(locationText, textLimit) : 'Checking Location...' }}</div>
    <q-popup-proxy>
      <boundary-filter :color="btnProps.color" v-model="km"></boundary-filter>
    </q-popup-proxy>
  </q-btn>

</template>

<script>
  import BoundaryFilter from 'components/common/atoms/filters/BoundaryFilter';
  import {mapGetters, mapState} from 'vuex';

  export default {
    name: 'BoundaryFilterButton',
    components: { BoundaryFilter },
    props: {
      textLimit: { type: Number, default: 28 },
      btnProps: {
        type: Object,
        default: () => {
          return {
            color: 'primary',
            textColor: 'dark'
          };
        }
      }
    },
    data() {
      return {
        km: 10,
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapState({ coordinates: 'coordinates', address: 'address' }),
      locationText() {
        return this.lget(this.address, 'formatted');
      }
    }
  };
</script>

<style scoped lang="scss">
  .__boundary_btn {
    border-radius: 8px;
    box-shadow: 0 0 6px rgba(0, 0, 0, .15);
    display: flex;
    align-items: center;
    flex-shrink: 2;
    cursor: pointer;
  }
</style>
