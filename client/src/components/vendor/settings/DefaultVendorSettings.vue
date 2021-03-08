<template>
  <q-card flat class="q-pa-md">
    <div class="text-sm text-mb-sm">Default Settings</div>
    <div class="text-xs text-mb-xs text-weight-light">Standard settings to apply to all synced settings instances</div>

    <q-toggle v-model="on" label="Customize Settings"></q-toggle>

    <q-slide-transition>
      <div v-if="on">
        <div class="__section" v-for="(section, i) in sections" :key="`section-${i}`">
          <div class="__section_header"  @click.stop="toggleOpen(section.label)">
            <div class="text-xs text-mb-xs text-weight-bold">{{ section.label }}</div>
            <q-space></q-space>
            <q-btn dense flat :icon="open.includes(section.label) ? 'mdi-menu-up' : 'mdi-menu-down'"></q-btn>
          </div>
          <q-slide-transition>
            <div class="q-py-md q-px-sm" v-if="open.includes(section.label)">
              <component :is="section.component" v-bind="section.attrs" @input="update(section.update, ...arguments)"></component>
            </div>
          </q-slide-transition>
        </div>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script>
  import common from '../../../store/schemas/common';
  import SchedulePicker from 'components/common/atoms/pickers/SchedulePicker';
  import CapacityPicker from 'components/products/forms/CapacityPicker';
  import TaxSettings from 'components/vendor/settings/tax/TaxSettings';
  import InventorySettings from 'components/vendor/settings/inventory/InventorySettings';

  export default {
    name: 'DefaultVendorSettings',
    components: { CapacityPicker, SchedulePicker },
    props: {
      startOn: Boolean,
      value: Object,
      serviceIn: String,
      idIn: { required: false },
      saveOnChange: Boolean,
      settingsPath: {
        type: String,
        default: 'settings'
      }
    },
    mounted() {

    },
    data() {
      return {
        open: [],
        on: false,
        form: common.VendorSettings,
        scheduleUpdates: 0
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.form = Object.assign({}, newVal);
            // Object.assign(this.form, Object.assign({}, newVal));
          }
        }
      },
      startOn: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal !== oldVal) {
            this.on = newVal;
          }
        }
      }
    },
    computed: {
      sections(){
        return [
          {
            label: 'Taxes',
            icon: '',
            component: TaxSettings,
            attrs: {
              value: this.form.tax
            },
            update: 'tax'
          },
          {
            label: 'Inventory',
            icon: '',
            component: InventorySettings,
            attrs: {
              value: this.form.inventory
            },
            update: 'inventory'
          },
          {
            label: 'Capacity',
            icon: '',
            component: CapacityPicker,
            attrs: {
              value: this.form.capacity,
              color: 'nice'
            },
            update: 'capacity'
          },
          {
            label: 'Schedule',
            icon: '',
            component: SchedulePicker,
            attrs: {
              value: this.form.schedule,
            },
            update: 'schedule'
          }
        ];
      }
    },
    methods: {
      toggleOpen(val) {
        let idx = this.open ? this.open.indexOf(val) : -1;
        if (idx > -1) this.open.splice(idx, 1);
        else this.open ? this.open.push(val) : this.open = [val];
      },
      updateSchedule() {
        this.$emit('input', this.form);
      },
      update(key, val) {
        this.form[key] = val;
        this.$emit('input', this.form);
        if (this.saveOnChange) {
          let patchObj = {};
          patchObj[key] = val;
          this.$store.dispatch(`${this.serviceIn}/patch`, [this.idIn, patchObj])
            .catch(err => this.$errNotify(err.message));
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .__section {

    .__section_header {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 14px;
      border-bottom: solid 1px rgba(0,0,0,.4);

      &:hover {
        background: rgba(66, 66, 66, .15);
      }
    }
  }
</style>
