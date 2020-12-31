<template>
  <div>
    <q-btn-dropdown
      push
      :color="color ? color : 'primary'"
      split
      :size="sizeIn"
    >
      <template v-slot:label>
        <div style="display: flex; align-items: center; justify-content: center">
          <template v-if="!multiple || value && value.length < 2">
          <div class="q-mr-md">
            <default-avatar v-if="selected" :avatar-path="optionAvatar" :size-in="['sm', 'xs'].includes(sizeIn) ? '24px' : ''" dark :value="selected"></default-avatar>
          </div>
          <div>{{lget(selected, optionLabel, emptyLabel)}}</div>
          </template>
          <template v-else>
            {{value.length}} Selected
          </template>
        </div>
      </template>

      <q-list>
        <q-item v-if="!options || !options.length">
          <div class="text-xs text-mb-xs text-italic text-weight-light">No options</div>
        </q-item>
        <q-item v-for="(ent, i) in options" :key="`ent-${i}`" clickable @click="selectOption(ent)">
          <q-item-section avatar>
            <default-avatar :avatar-path="optionAvatar" :value="ent"></default-avatar>
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
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'BtnPicker',
    components: { DefaultAvatar },
    props: {
      multiple: Boolean,
      color: String,
      sizeIn: String,
      value: [Object, String],
      options: Array,
      emitValue: Boolean,
      optionAvatar: {
        type: String,
        default: 'avatar'
      },
      optionValue: String,
      emptyLabel: {
        type: String,
        default: 'None'
      },
      optionLabel: {
        type: String,
        default: 'name'
      }
    },
    computed: {
      selected(){
        if(this.emitValue){
          if(!this.multiple) {
            let idx = this.options ? this.options.map(a => a[this.optionValue]).indexOf(this.value) : -1;
            if (idx > -1) return this.lget(this.options, [idx]);
            else return null;
          } else {
            if(this.options && this.value){
              return this.options.filter(a => this.value.includes(a));
            } else return [];
          }
        } else return this.value;
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
          this.$emit('input', payload);
        } else {
          let payload = this.emitValue ? val.map(a => a[this.optionValue]) : val;
          this.$emit('input', payload);
        }
      }
    }
  };
</script>
