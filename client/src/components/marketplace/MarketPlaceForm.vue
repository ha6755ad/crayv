<template>
  <q-page flat style="max-width: 100%" class="bg-light flex justify-center q-pa-md">
    <q-card flat style="width: 1200px; max-width: 100%;" class="q-pa-md">
      <div class="q-pa-md" :style="`width: 100%; height: ${lget(form, 'images') ? '225px' : '100px'};`">
        <multi-image-viewer flat :value="form" avatar-path="images">

          <template v-slot:content>
            <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
                   label="cover image" @click="imgDialog = true">
              <q-dialog v-model="imgDialog">
                <q-card>
                  <multi-image-upload add-label="Change Cover Photo" v-model="form.images"></multi-image-upload>
                </q-card>
              </q-dialog>
            </q-btn>
          </template>

        </multi-image-viewer>
        <div class="t-l q-ma-sm pointer" @click="avatarDialog = true">
          <default-avatar
            bg-in="dark"
            :value="form"
            size-in="100px"
            bordered>
          </default-avatar>
          <q-dialog v-model="avatarDialog">
            <single-image-upload v-model="form.avatar" add-label="Change Logo"></single-image-upload>
          </q-dialog>
        </div>
      </div>
      <q-input borderless input-class="text-sm text-mb-md text-weight-medium" placeholder="MarketPlace Name..."
               v-model="form.name"></q-input>
      <q-input placeholder="Add Description..." autogrow borderless input-class="text-xs text-mb-sm text-weight-light"
               v-model="form.description"></q-input>
      <div class="row q-py-sm items-end">
        <div class="col-8">
          <tag-picker
            service-in="crayv-marketplaces"
            v-model="form.tags"
            adding
          ></tag-picker>
        </div>
        <div class="col-4">
          <div class="row justify-end">
            <privacy-picker v-model="form.privacy"></privacy-picker>
          </div>
        </div>
      </div>

      <div class="q-py-sm q-mt-lg text-xs text-mb-sm text-weight-medium">
        MarketPlace Pricing
      </div>
      <q-separator class="q-my-sm"></q-separator>
      <div class="q-mt-lg q-mb-sm text-xxs text-mb-xs text-weight-bold">Supported Currencies
      </div>
      <currency-picker
        v-model="form.currency"
        emit-value
      ></currency-picker>

      <div class="row justify-end">
        <div>
          <div class="q-mt-md">
            <q-checkbox
              label="Support other currencies"
              color="secondary"
              v-model="multiCurrency"
            ></q-checkbox>
          </div>

          <div class="q-my-md" v-if="multiCurrency">
            <multi-currency-picker
              v-model="form.currencies"
            ></multi-currency-picker>
          </div>

        </div>
      </div>


      <q-separator class="q-my-sm"></q-separator>
      <div class="q-py-sm q-mt-lg text-xxs text-mb-xs text-weight-medium">
        Fees
      </div>
      <q-select
        label="Fee Type"
        :options="feeTypes"
        emit-value
        :value="lget(form, 'pricing.feeType')"
        @input="$lset(form, 'pricing.feeType', $event)"
      >
        <template v-slot:selected-item="scope">
          <q-chip dark color="nice" removable @remove="scope.removeAtIndex(scope.index)" :label="activeType.label"
                  :icon="activeType.icon">
          </q-chip>
        </template>
        <template v-slot:option="scope">
          <q-item clickable @click="scope.toggleOption(scope.opt)">
            <q-item-section avatar>
              <q-icon :name="scope.opt.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>

      <div class="q-my-md" v-if="lget(form, 'pricing.feeType') !== 'flat'">
        <div class="text-xxs text-mb-xxs text-weight-medium">Percentage Fee</div>
        <q-separator class="q-my-sm"></q-separator>
        <div class="row justify-end">
          <div class="col-6">
            <q-input
              input-class="text-right text-weight-medium"
              filled
              :value="lget(form, 'pricing.percentageFee')"
              @input="$lset(form, 'pricing.percentageFee', parseInt($event))"
              suffix="%"
              label="Percentage Fee"
              mask="##.##"
              hint="##.##% per transaction"
            ></q-input>
          </div>
        </div>
      </div>

      <div v-if="lget(form, 'pricing.feeType') !== 'percentage'">
        <div class="text-xxs text-mb-xxs text-weight-medium">Flat Fee Type</div>
        <q-separator class="q-my-sm"></q-separator>
        <div class="row">
          <div class="col-6">
            <q-option-group
              color="secondary"
              :value="lget(form, 'pricing.flatFeeType')"
              @input="$lset(form, 'pricing.flatFeeType', $event)"
              :options="[
               {label: 'Flat Recurring Fee', value: 'subscription'},
              {label: 'Per Transaction', value: 'transaction'}
              ]"
            ></q-option-group>
          </div>
          <div class="col-6 q-px-sm">
            <q-slide-transition>
              <template
                v-if="lget(form, 'pricing.feeType') !== 'percentage' && lget(form, 'pricing.flatFeeType') === 'subscription'">

                <r-rule-form
                  :value="lget(form, 'pricing.flatFeeRecurrence')"
                  @input="$lset(form, 'pricing.flatFeeRecurrence', $event)"
                ></r-rule-form>

              </template>
            </q-slide-transition>
          </div>
        </div>
        <div class="row justify-end q-my-md">

          <div class="col-6">
            <q-input
              input-class="text-right text-weight-medium"
              filled
              label="Flat Fee"
              :value="lget(form, 'pricing.flatFee')"
              @input="$lset(form, 'pricing.flatFee', Number($event))"
            ></q-input>
          </div>

        </div>
      </div>

      <q-separator class="q-my-sm"></q-separator>

      <div class="q-my-lg">
        <div class="text-xs text-mb-sm text-weight-medium">Marketplace admins</div>


        <template v-if="$isSuperAdmin(form) || isWhitelist(lget(user, 'email'))">
          <search-query
            :limit="25"
            service="users"
            optionLabel="name"
            optionAvatar="avatar"
            optionSubtitle="email"
            optionValue="_id"
            label="Add SuperAdmins"
            hint="People who have marketplace admin rights"
            :multiple="true"
            emit-value
            chip
            :query-in="{}"
            :value="lget(form, 'roles.superadmin', [])"
            @input="$lset(form, 'roles.superadmin', $event)"
          ></search-query>

        </template>

        <search-query
          :limit="25"
          service="users"
          optionLabel="name"
          optionAvatar="avatar"
          optionSubtitle="email"
          optionValue="_id"
          label="Add Admins"
          chip
          hint="People who have marketplace admin rights"
          :multiple="true"
          emit-value
          :query-in="{}"
          :value="lget(form, 'roles.admin', [])"
          @input="$lset(form, 'roles.admin', $event)"
        ></search-query>
      </div>

      <div class="row justify-end">
        <q-btn push color="secondary" label="Save Marketplace" @click="saveMarketplace"></q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script>
  import {models} from 'feathers-vuex';
  import SingleImageUpload from 'components/common/substance/images/SingleImageUpload';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import TagPicker from 'components/common/atoms/pickers/TagPicker';
  import PrivacyPicker from 'components/common/atoms/pickers/PrivacyPicker';
  import CurrencyPicker from 'components/common/atoms/pickers/CurrencyPicker';
  import MultiCurrencyPicker from 'components/common/atoms/pickers/MultiCurrencyPicker';
  import {vCheck} from 'src/mixins/ir-validate';
  import SearchQuery from 'components/common/atoms/search/SearchQuery';
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import MultiImageUpload from 'components/common/substance/images/MultiImageUpload';
  import RRuleForm from 'components/common/recurrance/RRuleForm';

  export default {
    name: 'MarketplaceForm',
    mixins: [vCheck],
    components: {
      RRuleForm,
      MultiImageUpload,
      MultiImageViewer,
      SearchQuery,
      MultiCurrencyPicker,
      CurrencyPicker,
      PrivacyPicker,
      TagPicker,
      DefaultAvatar,
      SingleImageUpload
    },
    props: {
      hostIn: Object,
      value: Object
    },
    mounted() {
      if (this.value) this.form = new models.api.CrayvMarketplaces(this.value).clone();
      if (this.lget(this.value, ['currencies', 0])) this.multiCurrency = true;
      if (!this.form.images) this.form.images = [{ large: { file: 'https://cdn.quasar.dev/img/material.png' } }];
    },
    data() {
      return {
        imgDialog: false,
        avatarDialog: false,
        showRecur: false,
        updateValidOnInput: true,
        form: new models.api.CrayvMarketplaces().clone(),
        multiCurrency: false
      };
    },
    watch: {
      hostIn: {
        immediate: true,
        handler(newVal, oldVal) {
          let newId = JSON.stringify(this.lget(newVal, '_id', 0));
          let oldId = JSON.stringify(this.lget(oldVal, '_id', 1));
          if (newId && newId !== oldId) {
            if (!this.form.name) this.form.name = newVal.name + ' Marketplace';
            if (!this.form.avatar) this.form.avatar = newVal.avatar;
            if (!this.form.images) this.form.images = [this.lget(newVal, 'image', { large: { file: 'https://cdn.quasar.dev/img/material.png' } })];
            this.form.host = newId;
          }
        }
      }
    },
    computed: {
      activeType() {
        return this.$arrayFilterZero(this.feeTypes.filter(a => a.value === this.lget(this.form, 'pricing.feeType')));
      },
      feeTypes() {
        return [
          {
            label: 'Percentage',
            description: 'Take a percentage of every transaction',
            value: 'percentage',
            icon: 'mdi-percent'
          },
          {
            label: 'Flat',
            description: 'Charge a flat fee',
            value: 'flat',
            icon: 'mdi-trending-neutral'
          },
          {
            label: 'Combination',
            description: 'Charge both a flat fee and a transaction split',
            value: 'combo',
            icon: 'mdi-chart-pie'
          },
          {
            label: 'Option',
            description: 'Allow the option to choose pricing plans',
            value: 'option',
            icon: 'mdi-routes'
          }
        ];
      },
      vCheckForm() {
        return this.form;
      },
      validCheck() {
        return {
          name: {
            name: 'Name',
            v: ['notEmpty', 'lt:30']
          },
          description: {
            name: 'Description',
            v: ['notEmpty']
          },
          'pricing.flatFee': {
            name: 'Flat fee amount',
            v: {
              check: this.lget(this.form, 'pricing.feeType') !== 'percentage' ? 'type' : null,
              arg: 'number'
            },
            error: 'cannot be empty if you are using flat fees'
          },
          'pricing.percentageFee': {
            name: 'Percentage fee amount',
            v: {
              check: this.lget(this.form, 'pricing.feeType') !== 'flat' ? 'type' : null,
              arg: 'number'
            },
            error: 'cannot be empty if you are using percentage fees'
          },
          'pricing.flatFeeRecurrence': {
            name: 'Fee Recurrence',
            v: {
              check: this.lget(this.form, 'pricing.feeType') !== 'percentage' && this.lget(this.form, 'pricing.flatFeeType') === 'subscription' ? 'notEmpty' : null,
            },
            error: 'You need to choose a recurring schedule for your fees or set them to "per-transaction"'
          },
        };
      }
    },
    methods: {
      saveMarketplace() {
        const errors = this.$vCheck(this.vCheckForm);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          this.form.save()
            .then(() => {
              this.$successNotify('Welcome to your own private economy');
            }).catch(err => this.$errNotify(err.message));
        }
      }
    }
  };
</script>
