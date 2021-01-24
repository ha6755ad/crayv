<template>
  <div>
    <q-btn-dropdown
      :push="push"
      :class="`bg-${color ? color : 'primary'} text-${textColor ? textColor : 'white'}`"
      :split="split"
      :outline="outline"
      :flat="flat"
      :rounded="rounded"
      :glossy="glossy"
      :size="sizeIn"
    >
      <template v-slot:label>
        <div style="display: flex; align-items: center; justify-content: center">
          <template v-if="!multiple || value && value.length === 1">
          <div class="q-mr-sm" v-if="selected">
            <default-avatar v-if="selected" :avatar-path="optionAvatar" :size-in="['sm', 'xs'].includes(sizeIn) ? '24px' : '35px'" dark :value="multiple ? lget(selected, [0]) : selected"></default-avatar>
          </div>
          <div>{{multiple ? lget(selected, [0, optionLabel], emptyLabel) : lget(selected, optionLabel, emptyLabel)}}</div>
          </template>
          <template v-else>
            {{value && value.length ? value.length + ' Selected' : emptyLabel}}
          </template>
        </div>
      </template>

      <q-list separator>
        <q-item dense v-if="beforeText || clearable" clickable @click="$emit('before')">
          <div class="row items-center" style="width: 100%">
          <div class="q-pa-sm text-xxs text-mb-xxs text-weight-bold">{{ beforeText }}</div>
            <q-space></q-space>
            <q-btn flat v-if="clearable" size="sm" round icon="mdi-close-circle" @click="$emit('input', multiple ? [] : undefined)"></q-btn>
          </div>
        </q-item>
        <q-item v-if="!options || !options.length">
          <div class="text-xs text-mb-xs text-italic text-weight-light">No options</div>
        </q-item>
        <q-item v-for="(ent, i) in options" :key="`ent-${i}`" clickable @click="handleInput(ent)" style="position: relative">
          <q-item-section avatar>
            <default-avatar :avatar-path="optionAvatar" :value="ent"></default-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{lget(ent, optionLabel)}}</q-item-label>
          </q-item-section>
          <q-item-section side v-if="$scopedSlots.side">
            <slot name="side" :item="ent"></slot>
          </q-item-section>
          <q-btn dense flat size="sm" class="t-r-a" icon="mdi-checkbox-marked-circle-outline" color="positive" v-show="isSelected(ent)">
          </q-btn>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {SelectMixin} from 'src/mixins/SelectMixin';

  export default {
    name: 'BtnPicker',
    components: { DefaultAvatar },
    mixins: [SelectMixin],
    props: {
      split: Boolean,
      outline: Boolean,
      clearable: Boolean,
      flat: Boolean,
      push: Boolean,
      glossy: Boolean,
      rounded: Boolean,
      beforeText: String,
      multiple: Boolean,
      color: String,
      textColor: String,
      sizeIn: String,
      value: [Object, String, Array],
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

    },
    methods: {

    }
  };
</script>
