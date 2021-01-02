<template>
  <div>
    <q-btn-dropdown
      :dense="dense"
      :push="push"
      :flat="flat"
      :color="color ? color : 'primary'"
      :size="sizeIn"
      :label="labelOff ? '' : multiple ? selected && selected.length ? selected.length + ' selected': emptyLabel : lget(activeItem, optionLabel, emptyLabel)"
      :icon="multiple ? 'mdi-cursor-default-click' : lget(activeItem, 'icon')"
    >
      <q-list>
        <q-item v-if="!options || !options.length">
          <div class="text-xs text-mb-xs text-italic text-weight-light">No options</div>
        </q-item>
        <q-item v-for="(ent, i) in options" :key="`ent-${i}`" clickable @click="selectOption(ent)">
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
  import {SelectMixin} from 'src/mixins/SelectMixin';

  export default {
    name: 'CurrencyPicker',
    mixins: [SelectMixin],
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
      optionsIn: Array,
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

    },
    computed: {
      ...mapState('currency', {currencies: 'national_currencies'}),
      options(){
        return this.optionsIn ? this.optionsIn : this.currencies;
      },
    },
    methods: {
      selectOption(val) {
        console.log('select in currency picker', val);
        this.handleInput(val);
      }
    }
  };
</script>
