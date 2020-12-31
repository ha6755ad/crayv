<template>
  <div>
    <q-btn-dropdown
      push
      :color="color ? color : 'primary'"
      split
      :size="sizeIn"
      :label="lget(selected, optionLabel, emptyLabel)"
      :icon="lget(selected, 'icon')"
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
            <q-item-label caption v-if="!hideDescription">{{lget(ent, 'description')}}</q-item-label>
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

  export default {
    name: 'PrivacyPicker',
    components: {  },
    props: {
      hideDescription: Boolean,
      multiple: Boolean,
      color: String,
      sizeIn: String,
      value: [Object, String],
      options: {
        type: Array,
        default: function(){
          return [
            {name: 'Private', description: 'only you', value: 'private', icon: 'mdi-lock'},
            {name: 'Public', description: 'anyone', value: 'public', icon: 'mdi-link'},
            {name: 'By Permission', description: 'people you grant access to', value: 'permission', icon: 'mdi-key'}
          ];
        }
      },
      emitValue: {type: Boolean, default: true},
      optionValue: {
        type: String,
        default: 'value'
      },
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
