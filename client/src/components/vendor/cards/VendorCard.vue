<template>
  <q-card :flat="flat" :dark="dark" style="width: 100%; border-radius: 10px">
    <div class="flex items-center t-r">
      <q-btn v-if="editing" size="sm" flat dense icon="mdi-pencil-box" @click="editDialog = true"></q-btn>
      <q-btn v-if="active" size="sm" flat dense icon="mdi-checkbox-marked-outline" color="positive"></q-btn>
    </div>

    <q-img :src="getAvatar(value, 'img')">
      <div class="absolute-bottom q-pa-md" style="height: 50%">
        <div class="row items-center">
          <default-avatar :value="value"></default-avatar>
        </div>
        <div class="text-xs text-mb-xs text-weight-bold">{{lget(value, 'name')}}</div>
        <div class="text-xs text-mb-xs text-weight-bold">{{lget(value, 'description')}}</div>
      </div>
    </q-img>


    <q-dialog position="right" :maximized="$q.screen.lt.sm" transition-hide="slide-right" transition-show="slide-left" v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <vendor-form :value="value"></vendor-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import VendorForm from 'components/vendor/forms/VendorForm';
  export default {
    name: 'VendorCard',
    components: { VendorForm, DefaultAvatar },
    props: {
      active: Boolean,
      value: Object,
      flat: Boolean,
      dark: Boolean,
      editing: Boolean
    },
    data(){
      return {
        editDialog: false
      };
    },
    computed: {

    }
  };
</script>
