<template>
  <div class="col-12">
    <q-select
      label="Search Banks"
      ref="bankSelect"
      v-model="selectedBank"
      @keyup.enter="selectBank({NAME: searchInput})"
      use-input
      :options="banks"
      @input-value="(val) => searchInput = val"
    >
      <template v-slot:before-options>
        <q-item dense>
          <q-item-section>
            <q-item-label class="text-weight-bold text-italic">Choose or add financial institution</q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section>
            <q-item-label>
              <div class="text-0-8 text-italic">No Banks Found - Hit enter to insert manual entry</div>
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>

      <template v-slot:selected-item="scope">
        <q-chip dark style="background: #111a45" :label="lGetFromTemplate(scope.opt, 'name')" removable @remove="selectedBank = {}"/>
      </template>

      <template v-slot:option="scope">
        <q-item clickable @click="selectBank(scope.opt)">
          <q-item-section>
            <q-item-label>{{lGetFromTemplate(scope, 'opt.name', '')}}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  export default {
    name: 'BankPicker',
    props: {
      value: Object
    },
    data() {
      return {
        selectedBank: {},
        searchInput: '',
        banks: []
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal){
          if(newVal && newVal.name){
            this.selectedBank = Object.assign({}, newVal);
          }
        }
      },
      searchInput: {
        immediate: true,
        handler(newVal) {
          if (newVal && newVal.length > 0) {
            this.searchBanks();
          }
        }
      }
    },
    computed: {
      bankName() {
        return this.$lget(this.selectedBank, 'name', '');
      }
    },
    methods: {
      ...mapActions('bank-data', { loadBanks: 'find' }),
      selectBank(val) {
        this.selectedBank = val;
        this.searchInput = '';
        this.$emit('input', val);
      },
      async searchBanks() {
        if (this.searchInput.length % 4 === 0) {
          this.$refs.bankSelect.hidePopup();
          await this.loadBanks({
            query: {
              name: this.searchInput
            },
            paginate: true,
            $limit: 10
          }).then(res => {
            console.log('got banks', res);
            this.banks = res;
            this.$refs.bankSelect.showPopup();
          }).catch(err => {
            console.log('error getting banks', err);
          });
        }
      }
    }
  };
</script>
