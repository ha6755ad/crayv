<template>
  <q-card class="q-pa-md" style="height: 100%; width: 100%">

    <q-btn v-if="form._id" icon="mdi-delete" color="red" flat dense class="t-r" @click="remove"></q-btn>

    <vendor-picker emit-value v-model="form.vendorId"></vendor-picker>

    <div class="text-sm q-my-sm text-mb-sm text-weight-light">{{ value ? 'Edit' : 'Add' }} Product</div>


    <div class="row q-my-sm">
      <div class="col-12 q-gutter-md">
        <div class="row justify-end">
          <q-checkbox label="Active" v-model="form.active"></q-checkbox>
        </div>
        <q-input
          :error-message="$vErrorMessage('name')"
          :error="$vErrorCheck('name')"
          label="Product Name"
          v-model="form.name"
        />
        <q-input
          :error-message="$vErrorMessage('description')"
          :error="$vErrorCheck('description')"
          type="textarea" filled
          label="Product Description"
          v-model="form.description"/>

        <div class="row justify-center">
          <multi-image-upload v-model="form.images"></multi-image-upload>
        </div>


        <q-select style="z-index: 1"
                  :options="appProductTypes"
                  label="Product Type"
                  :value="form.types ? form.types : []"
                  behavior="menu"
                  @input="(val) => form.types = [val]"
                  emit-value
        >
          <template v-slot:selected-item>
            <q-chip dark class="bg-dark text-light" removable @remove="form.type = null"
                    :label="lget(activeType, 'name')"></q-chip>
          </template>
          <template v-slot:option="scope">
            <q-item clickable @click="form.type = scope.opt.value">
              <q-item-section>
                <q-item-label>{{ scope.opt.name }}</q-item-label>
                <q-item-label caption>{{ scope.opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          label="Currency"
          v-model="form.price.currency"
          :options="['usd', 'ngn']"
        />
        <price-picker :currency-in="lget(form, 'price.currency', 'usd')" v-model="form.price.basePrice"/>

        <q-separator class="q-my-md"/>

        <div class="row q-my-md text-xs text-mb-xs text-weight-light">Product Variants
          <q-space/>
          <q-btn flat size="sm" icon="mdi-plus" label="add new" @click="variantDialog = true">
            <q-dialog v-model="variantDialog" :maximized="$q.screen.lt.sm" transition-show="slide-down">
              <q-card style="width: 600px; max-width: 100vw">
                <q-btn class="t-r" round flat icon="mdi-close" @click="variantDialog = false"/>
                <product-variant-form @input="handleVariant"/>
              </q-card>
            </q-dialog>
          </q-btn>
        </div>
        <q-separator></q-separator>
        <q-list dense separator>
          <q-item v-for="(variant, i) in lget(form, 'variants', [])" :key="`var-${i}`">
            <product-variant-item
              editing
              closeable
              @close="rmvVariant(i)"
              flat
              v-model="form.variants[i]"
            ></product-variant-item>
          </q-item>
        </q-list>

        <q-slide-transition>
          <div v-if="trackInventory">
            <q-input :value="form.inventory.stock" label="Current Stock" @input="changeStock"></q-input>
            <div class="text-xxs text-mb-xxs text-weight-light q-pa-sm">There are currently <b>{{lget(form, 'inventory.pending', 0) * -1}}</b> committed in pending orders</div>

          </div>
        </q-slide-transition>

        <q-separator class="q-my-sm"></q-separator>

        <q-checkbox label="Allow Group Orders" v-model="form.groupOrders"/>

      </div>
    </div>

    <q-separator class="q-my-sm"></q-separator>

    <div class="row q-my-sm">
      <q-checkbox color="nice" v-model="form.settings.syncSettings" label="Sync with vendor settings"></q-checkbox>
    </div>

    <q-slide-transition>
      <template v-if="!form.settings.syncSettings">
        <div class="q-my-md">
          <default-product-settings
            schedule-off
            :save-on-change="false"
            :id-in="form._id"
            service-in="crayv-products"
            @input="$lset(form, 'settings.productSettings', $event)"
            :value="lget(form, 'settings.productSettings')"
          ></default-product-settings>
        </div>
      </template>
    </q-slide-transition>

    <div class="row justify-end q-pa-sm">
      <q-btn label="Save Product" color="primary" @click="saveProduct(form)"/>
    </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import {mapGetters} from 'vuex';
  import ProductVariantForm from './ProductVariantForm';
  import PricePicker from '../../common/atoms/pickers/PricePicker';
  import VendorPicker from 'components/common/pickers/VendorPicker';
  import {vCheck} from 'src/mixins/ir-validate';
  import MultiImageUpload from 'components/common/substance/images/MultiImageUpload';
  import ProductVariantItem from 'components/products/card/ProductVariantItem';
  import DefaultProductSettings from 'components/products/settings/DefaultProductSettings';

  export default {
    name: 'ProductForm',
    mixins: [vCheck],
    components: { DefaultProductSettings, ProductVariantItem, MultiImageUpload, VendorPicker, PricePicker, ProductVariantForm },
    props: {
      value: Object,
      vendorIn: Object
    },
    mounted() {
      if (this.value){
        Object.assign(this.form, Object.assign({}, this.value));
        this.stockChange = true;
      }
      if (this.vendorIn) this.vendor = this.vendorIn;
    },
    data() {
      return {
        stockChange: false,
        updateValidOnInput: true,
        variantDialog: false,
        adding: true,
        vendor: null,
        form: new models.api.CrayvProducts().clone()
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters({ vendorContext: 'vendorContext' }),
      ...mapGetters('crayv-promotions', { findPromos: 'find' }),
      ...mapGetters('crayv-products', { findProducts: 'find' }),
      ...mapGetters('subscriptions', { findSubscriptions: 'find' }),
      ...mapGetters('crayv-vendors', { findVendors: 'find' }),
      statePromos() {
        return this.findPromos().data;
      },
      trackInventory(){
        return this.lget(this.vendorContext, 'settings.trackInventory') && this.lget(this.form, 'settings.syncSettings') || this.lget(this.form, 'settings.trackInventory');
      },
      stateProducts() {
        return this.findProducts().data;
      },
      stateSubscriptions() {
        return this.findSubscriptions().data;
      },
      appProductTypes() {//meant to load in app specific type options
        return [
          {
            name: 'Content',
            description: 'Videos, blogs, podcasts, or learning modules',
            value: 'content'
          },
          {
            name: 'Physical Goods',
            description: 'Tangible, deliverable goods',
            value: 'physical'
          },
          {
            name: 'Service',
            description: 'Intangible services provided for a fee',
            value: 'service'
          },
          {
            name: 'Subscription',
            description: 'Rights of participation in a group',
            value: 'subscription'
          },
          {
            name: 'Ticket',
            description: 'Event Ticketing',
            value: 'event'
          }];
      },
      activeType() {
        return this.$arrayFilterZero(this.appProductTypes.filter(a => a.value === this.form.type));
      },
      vCheckForm() {
        return this.form;
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty'] },
          description: { name: 'Description', v: ['notEmpty'] },
          type: { name: 'Type', v: ['notEmpty'] },
          images: { name: 'Images', v: ['notEmpty'] },
          vendorId: { name: 'Vendor', v: ['notEmpty'] },
          price: { name: 'Price', v: ['notEmpty'] }
        };
      }
    },
    methods: {
      rmvVariant(i) {
        this.$q.dialog({
          message: `Remove ${this.lget(this.form, ['variants', i, 'name'], 'Variant')}?`,
          ok: {
            color: 'positive',
            push: true,
            size: 'sm'
          },
          cancel: {
            color: 'negative',
            flat: true,
            size: 'sm'
          }
        }).onOk(() => {
          this.form.variants.splice(i, 1);
        });
      },
      async saveProduct() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          console.log('saving product', this.form);
          await this.form.save()
            .then(res => {
              this.$successNotify('Got yerself a product!');
              this.$emit('input', res);
            })
            .catch(err => {
              console.log('error saving product', err);
              this.$errNotify(err.message);
            });
        }
      },
      handleVariant(val, idx) {
        if (idx > -1) {
          this.form.variants.splice(idx, 1, val);
        } else {
          this.form.variants ? this.form.variants.push(val) : this.form.variants = [val];
        }
        this.variantDialog = false;
      },
      changeStock(){
        if(this.stockChange) {
          this.$q.dialog({
            title: 'Note on changing stock',
            message: 'Your stock number is how we know if you have enough product to take an order. We are just making sure you are intentionally changing this number'
          }).onDismiss(() => {
            this.stockChange = false;
          });
        }
      },
      remove() {
        this.$q.dialog({
          title: `Delete ${this.form.name}?`,
          message: 'This is usually not recommended. Instead you can mark the product inactive',
          ok: {
            flat: true,
            color: 'negative',
            size: 'sm',
            label: 'No delete it'
          },
          cancel: {
            push: true,
            color: 'nice',
            size: 'sm',
            label: 'Mark Inactive'
          }
        }).onOk(() => {
          this.$store.dispatch('crayv-products/remove', this.form._id)
            .then(() => {
              this.$successNotify('Product Archived');
              this.$emit('input', null);
            })
            .catch(err => this.$errNotify(err.message));
        }).onCancel(() => {
          this.$store.dispatch('crayv-products/patch', [this.form._id, { active: false }])
            .then(res => {
              this.$successNotify('Inactivated');
              this.$emit('input', res);
            })
            .catch(err => this.$errNotify(err.message));
        });
      }
    }
  }
  ;
</script>

<style scoped lang="scss">
  .prod_img_preview {
    height: 150px;
    width: 150px;
    overflow: hidden;
    margin: 10px;

    img {
      object-fit: cover;
    }
  }
</style>
