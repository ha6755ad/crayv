<template>
  <q-card :flat="flat" :dark="dark" style="width: 100%">
    <div class="flex items-center t-r">
      <q-btn v-if="editing" size="sm" flat dense icon="mdi-pencil-box" @click="editDialog = true"></q-btn>
      <q-btn v-if="active" size="sm" flat dense icon="mdi-checkbox-marked-outline" color="positive"></q-btn>
    </div>

    <q-item clickable @click="$emit('add', value)">
      <q-item-section avatar>
        <default-avatar :value="value" square></default-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-xxs text-mb-xs text-weight-medium">{{lget(value, 'name', 'Untitled')}}</q-item-label>
        <q-item-label class="text-xxxs text-mb-xxx" caption>
          <div class="__one-liner">
            {{lget(value, 'description', 'Untitled')}}
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <template v-slot:side></template>
      </q-item-section>
    </q-item>

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
  import VendorForm from 'components/products/vendor/VendorForm';
  export default {
    name: 'VendorItem',
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
