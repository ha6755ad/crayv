<template>
  <q-card flat class="q-pa-md">
    <div class="text-sm text-mb-sm">Default Settings</div>
    <div class="text-xs text-mb-xs text-weight-light">Standard settings to apply to all synced settings instances</div>

    <q-toggle v-model="on" label="Customize Settings"></q-toggle>

    <q-slide-transition>
      <div v-if="on">
        <div class="q-py-md">
          <q-item v-if="!form.taxExempt">
            <q-item-section avatar>
              <q-checkbox color="nice" v-model="form.automateTaxes" @input="update('automateTaxes', ...arguments)"></q-checkbox>
            </q-item-section>
            <q-item-section>
              <q-item-label>Automate tax rates</q-item-label>
              <q-item-label caption>
                {{
                  form.automateTaxes ? 'You are allowing our smart tax database to decide your tax rates.' : 'Its up to you to dictate your tax rates and boundaries'
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator></q-separator>
          <q-item>
            <q-item-section avatar>
              <q-checkbox color="nice" v-model="form.taxExempt" @input="update('taxExempt', ...arguments)"></q-checkbox>
            </q-item-section>
            <q-item-section>
              <q-item-label>Tax Exempt</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <div class="row q-my-sm">
          <q-checkbox color="nice" @input="update('trackInventory', ...arguments)" label="Track Inventory" v-model="form.trackInventory"></q-checkbox>
        </div>

        <capacity-picker color="nice" v-model="form.capacity"></capacity-picker>

        <custom-tax-form></custom-tax-form>
        <div class="q-my-md q-pa-sm" style="max-height: 600px; overflow-y: scroll">
          <div class="text-xs text-mb-xs">Hours of Operation</div>
          <schedule-picker
            v-model="form.schedule"
            @input="updateSchedule('schedule', ...arguments)"
          ></schedule-picker>
        </div>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script>
  import common from '../../../store/schemas/common';
  import SchedulePicker from 'components/common/atoms/pickers/SchedulePicker';
  import CustomTaxForm from 'components/products/tax/CustomTaxForm';
  import CapacityPicker from 'components/products/forms/CapacityPicker';

  export default {
    name: 'DefaultVendorSettings',
    components: { CapacityPicker, CustomTaxForm, SchedulePicker },
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
            Object.assign(this.form, Object.assign({}, newVal));
          }
        }
      },
      startOn: {
        immediate: true,
        handler(newVal, oldVal){
          if(newVal !== oldVal){
            this.on = newVal;
          }
        }
      }
    },
    methods: {
      updateSchedule() {
        this.$emit('input', this.form);
      },
      update(key, val) {
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

<style scoped>

</style>
