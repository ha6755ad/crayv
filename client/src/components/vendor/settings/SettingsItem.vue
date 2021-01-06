<template>
  <div>
    <div class="t-r">
      <q-btn v-if="editing" icon="mdi-pencil-box" @click="editDialog = true" dense flat size="sm"></q-btn>
    </div>
    <q-item clickable @click="$emit('add', value)">
      <q-item-section avatar>
        <default-avatar :value="value"></default-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-xs text-mb-xs text-weight-medium">{{lget(value, 'name')}}</q-item-label>
        <q-item-label class="text-xxs text-mb-xxs">Settings for {{lget(stateVendor, 'name')}}</q-item-label>
      </q-item-section>
    </q-item>

    <q-dialog v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat icon="mdi-close" @click="editDialog = false"/>

      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import {mapGetters} from 'vuex';
  export default {
    name: 'SettingsItem',
    components: { DefaultAvatar },
    props: {
      value: Object,
      editing: Boolean
    },
    data(){
      return {
        editDialog: false
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          let id = this.lget(newVal, 'vendor');
          if(id && this.$lisEmpty(this.stateVendor)){
            this.$store.dispatch('crayv-vendors/get', id);
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { stateUser: 'user' }),
      ...mapGetters('crayv-vendors', { getVendor: 'get' }),
      stateVendor(){
        let id = this.lget(this.value, 'vendor');
        if(id) return this.getVendor(id);
        else return null;
      }
    }
  };
</script>

<style scoped>

</style>
