<template>
  <div>
    <div class="q-pa-sm text-xs text-mb-xs text-weight-medium">
      <div>Fulfillment Capacity</div>
      <div class="text-xxs text-mb-xxs text-weight-light">Establish how much order volume you can handle by timeframe (per settings location - overrides can be set at the product level)
      </div>
    </div>
    <div class="row items-center justify-around">
      <div class="q-pa-sm" style="width: 100px" v-for="(item, i) in capacities" :key="`capacity-${i}`">
        <q-input
          :color="color"
          dense
          :label="item.label"
          :hint="item.hint"
          v-model.number="form[item.value]"
          @input="handleInput"
          input-class="text-xxs text-mb-xxs text-weight-bold"
        ></q-input>
      </div>
    </div>
  </div>
</template>

<script>
  const defaultCapacity = () => {
    return {
      once: 0,
      hour: 0,
      day: 0,
      month: 0,
    };
  };

  export default {
    name: 'CapacityPicker',
    props: {
      color: String,
      value: Object
    },
    mounted() {
      if (this.value) Object.assign(this.form, Object.assign({}, this.value));
    },
    data() {
      return {
        form: defaultCapacity()
      };
    },
    computed: {
      capacities() {
        return [
          {
            label: 'Singe Order',
            hint: 'capacity',
            value: 'once'
          },
          {
            label: 'One Hour',
            hint: 'capacity',
            value: 'hour'
          },
          {
            label: 'One Day',
            hint: 'capacity',
            value: 'day'
          },
          {
            label: 'One Month',
            hint: 'capacity',
            value: 'month'
          }
        ];
      }
    },
    methods: {
      handleInput(){
        this.$emit('input', this.form);
      }
    }
  };
</script>

<style scoped>

</style>
