<template>
  <div class="pointer">
    <q-chip :size="size">
      <default-avatar v-if="activeVendor" :value="activeVendor"></default-avatar>
      {{ activeVendor ? activeVendor.name : 'Select Vendor' }}
      <q-icon name="mdi-menu-down"/>
    </q-chip>
    <q-menu>
      <q-item dense>
        <q-input dense placeholder="Search..." v-model="searchInput">
          <template v-slot:prepend>
            <q-icon name="mdi-magnify"></q-icon>
          </template>
        </q-input>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Your Vendor Accounts</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn @click.stop="signUp" flat round icon="mdi-plus"/>
        </q-item-section>
      </q-item>
      <q-item v-for="(vend, i) in vendors" :key="`vend-${i}`" clickable>
        <vendor-item :active="isSelected(vend)" flat @input="vendorInput" :value="vend" editing></vendor-item>
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
  import {mapGetters} from 'vuex';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import VendorItem from 'components/vendor/cards/VendorItem';
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import {makeFindPaginateMixin} from '@ionrev/iy-common-client-lib';

  export default {
    name: 'VendorPicker',
    mixins: [SelectMixin, makeFindPaginateMixin({
      qid: 'vendors',
      name: 'vendors',
      query() {
        return this.queryAdders;
      },
      service: 'crayv-vendors'
    })],
    components: { VendorItem, DefaultAvatar, VendorForm },
    props: {
      queryOverride: Boolean,
      queryIn: Object,
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
    },
    data() {
      return {
        searchInput: '',
        loadService: 'crayv-vendors',
        vendorIndex: 0,
        editVendor: {},
        signUpDialog: false,
      };
    },
    watch: {
      signUpTrigger: {
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal || oldVal) {
            this.signUpDialog = true;
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters({ vendorContext: 'vendorContext' }),
      queryAdders() {
        let id = this.lget(this.user, '_id');
        let query = {
          $or: [
            { owner: id },
            { 'roles.superAdmin': { $in: [id] } },
            { 'roles.admin': { $in: [id] } }
          ]
        };
        let text = this.searchInput;
        if (text && typeof (text) === 'string' && text.length) {
          let nameSearch = {
            $regex: `${text}`,
            $options: 'igm'
          };
          query.name = nameSearch;
        }
        return this.queryOverride ? this.queryIn : this.queryIn ? {...query, ...this.queryIn} : query;
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
        if (this.setContext) {
          this.$store.dispatch('setVendorContext', vendor);
        }
        this.handleInput(vendor);
      }
    }
  };
</script>
