<template>
  <div class="pointer">
    <q-chip :size="size">
      <default-avatar v-if="activeVendor" :value="activeVendor"></default-avatar>
      {{activeVendor ? activeVendor.name : 'Select Vendor'}}
      <q-icon name="mdi-menu-down"/></q-chip>
    <q-menu>
      <q-item>
        <q-item-section>
          <q-item-label>Your Vendor Accounts</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn @click.stop="signUp" flat round icon="mdi-plus"/>
        </q-item-section>
      </q-item>
      <q-item v-for="(vend, i) in stateItems" :key="`vend-${i}`" clickable>
        <vendor-item :active="isSelected(vend)" flat @add="vendorInput" :value="vend" editing></vendor-item>
      </q-item>
    </q-menu>
    <q-dialog v-model="signUpDialog" :maximized="$q.screen.lt.sm">
      <q-card style="width: 600px; max-width: 100vw">
        <vendor-form></vendor-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import VendorForm from 'components/vendor/forms/VendorForm';
  import {loadPaginatedMixin} from 'src/mixins/LoadPaginatedMixin';
  import {mapGetters} from 'vuex';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import VendorItem from 'components/vendor/cards/VendorItem';
  import {SelectMixin} from 'src/mixins/SelectMixin';

  export default {
    name: 'VendorPicker',
    mixins: [loadPaginatedMixin, SelectMixin],
    components: { VendorItem, DefaultAvatar, VendorForm },
    props: {
      multiple: Boolean,
      emitValue: Boolean,
      size: {
        type: String,
        default: 'large'
      },
      setContext: Boolean,
      value: {
        required: false
      },
      signUpTrigger: Boolean
    },
    mounted() {
      if (this.activeVendor) this.$emit('input', this.activeVendor);
      this.reloadItems(0);
    },
    data() {
      return {
        loadService: 'crayv-vendors',
        vendorIndex: 0,
        editVendor: {},
        signUpDialog: false,
      };
    },
    watch: {
      signUpTrigger: {
        immediate: true,
        handler(newVal, oldVal){
          if(newVal || oldVal){
            this.signUpDialog = true;
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters({ vendorContext: 'vendorContext' }),
      queryAdders(){
        let id = this.lget(this.user, '_id');
        let query = {
          $or: [
            { owner: id },
            { 'roles.superAdmin': { $in: [id] } },
            { 'roles.admin': { $in: [id] } }
          ]
        };
        return this.queryIn ? this.queryIn : query;
      },
      activeVendor() {
        return this.setContext ? this.vendorContext : this.activeItem;
      },
    },
    methods: {
      signUp() {
        this.signUpDialog = true;
      },
      vendorInput(vendor) {
        console.log('vendor input', vendor);
        if(this.setContext){
          this.$store.dispatch('setVendorContext', vendor);
        }
        this.handleInput(vendor);
      }
    }
  };
</script>
