<template>
  <q-card flat class="q-pa-md">

    <q-btn size="sm" color="negative" @click="$emit('rmv')" class="t-r" dense flat></q-btn>

    <div class="text-xs text-mb-sm q-pb-md">Add Link</div>
    <div class="col-12 q-gutter-lg">
      <q-input outlined placeholder="Link" v-model="form.link">
        <template v-slot:prepend>
          <q-icon name="mdi-link"></q-icon>
        </template>
      </q-input>
      <q-input outlined placeholder="Label" v-model="form.label">
        <template v-slot:prepend>
          <q-icon name="mdi-label"></q-icon>
        </template>
      </q-input>

      <div class="text-xxs text-mb-xxs text-weight-medium">Add Icon</div>
    <div class="row justify-around">
      <q-btn :color="form.icon === icon ? 'primary' : ''" flat dense v-for="(icon, i) in socialIcons" :key="`icon-${i}`" :icon="icon" @click="form.icon = icon"></q-btn>
    </div>
    <icon-picker v-model="form.icon"></icon-picker>

    <div class="q-pa-md row justify-end">
      <q-btn push color="primary" label="Save" @click="$emit('input', form)"></q-btn>
    </div>
    </div>
  </q-card>
</template>

<script>
  import IconPicker from '../atoms/pickers/iconPicker';
  export default {
    name: 'LinkForm',
    components: { IconPicker },
    props: {
      value: Object
    },
    data(){
      return {
        form: {
          icon: '',
          link: '',
          label: ''
        }
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal){
            this.form = newVal;
          }
        }
      }
    },
    computed: {
      socialIcons(){
        return ['mdi-facebook', 'mdi-instagram', 'mdi-twitter', 'mdi-linkedin', 'mdi-github'];
      }
    }
  };
</script>
