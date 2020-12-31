<template>
  <div>
    <q-btn-dropdown
      :dense="dense"
      :push="push"
      :flat="flat"
      :color="color ? color : 'primary'"
      :size="sizeIn"
      :label="labelOff ? '' : multiple ? selected && selected.length ? selected.length + ' selected': emptyLabel : lget(selected, optionLabel, emptyLabel)"
      :icon="multiple ? 'mdi-cursor-default-click' : lget(selected, 'icon')"
    >
      <q-list>
        <q-item v-if="!currencyOptions || !currencyOptions.length">
          <div class="text-xs text-mb-xs text-italic text-weight-light">No currencyOptions</div>
        </q-item>
        <q-item v-for="(ent, i) in currencyOptions" :key="`ent-${i}`" clickable @click="selectOption(ent)">
          <q-item-section avatar>
            <q-icon :name="ent.icon"/>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{lget(ent, optionLabel)}}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon dense flat size="sm" icon="mdi-checkbox-marked-circle-outline" color="light-green" v-show="isSelected(ent)"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>

  import {mapState} from 'vuex';

  export default {
    name: 'CurrencyPicker',
    components: {  },
    props: {
      dense: Boolean,
      push: {
        type: Boolean,
        default: true
      },
      flat: Boolean,
      multiple: Boolean,
      color: String,
      sizeIn: String,
      value: [Object, String, Array],
      labelOff: Boolean,
      emitValue: {type: Boolean, default: true},
      options: Array,
      optionValue: {
        type: String,
        default: 'value'
      },
      emptyLabel: {
        type: String,
        default: 'Select Currency'
      },
      optionLabel: {
        type: String,
        default: 'name'
      }
    },
    data(){
      return {
        selected: null
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(this.emitValue){
            if(!this.multiple) {
              let idx = this.currencyOptions ? this.currencyOptions.map(a => a[this.optionValue]).indexOf(newVal) : -1;
              if (idx > -1) this.selected = this.lget(this.currencyOptions, [idx]);
              else this.selected = null;
            } else {
              if(this.currencyOptions && newVal){
                if(!this.emitValue) {
                  this.selected = this.currencyOptions.filter(a => newVal.includes(a));
                } else {
                  this.selected = this.currencyOptions.filter(a => newVal.includes(a[this.optionValue]));
                }
              } else return [];
            }
          } else this.selected = newVal;
        }
      }
    },
    computed: {
      ...mapState('currency', {currencies: 'national_currencies'}),
      currencyOptions(){
        return this.options ? this.options : this.currencies;
      }
    },
    methods: {
      isSelected(val){
        if(Array.isArray(this.value)){
          return this.emitValue ? this.value.includes(val[this.optionValue]) : this.value.includes(val);
        } else {
          return this.emitValue ? this.value === val[this.optionValue] : this.value === val;
        }
      },
      selectOption(val){
        if(!this.multiple) {
          let payload = this.emitValue ? val[this.optionValue] : val;
          this.selected = val;
          this.$emit('input', payload);
        } else {
          let list = this.emitValue ? this.selected.map(a => a[this.optionValue]) : this.selected;
          let item = this.emitValue ? val[this.optionValue] : val;
          let idx = list.indexOf(item);
          console.log('got idx', idx, item, list);
          if(idx > -1) {
            list.splice(idx, 1);
            this.selected.splice(idx, 1);
          }
          else {
            list.push(item);
            this.selected.push(val);
          }
          console.log('emit multiple', list);
          this.$emit('input', list);
        }
      }
    }
  };
</script>
