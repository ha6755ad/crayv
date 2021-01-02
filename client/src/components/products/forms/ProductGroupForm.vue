<template>
  <q-card>
    <q-toolbar :class="`bg-accent text-${$getTextColor('--q-color-accent')}`">
      <div class="text-xs text-mb-xs text-weight-bold">{{ form && form._id ? 'Edit' : 'Add' }} Product Group</div>
    </q-toolbar>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-gutter-sm">
          <q-input
            :error-message="$vErrorMessage('name')"
            :error="$vErrorCheck('name')"
            label="Product Group Name"
            v-model="form.name"
          />
          <q-input
            :error-message="$vErrorMessage('description')"
            :error="$vErrorCheck('description')"
            type="textarea"
            filled
            label="Description"
            v-model="form.description"
          />
          <q-card-section>
            <div class="row text-xxs text-mb-xxs text-weight-medium">Add Cover Images</div>
            <div class="row text-xxs text-mb-xxs text-weight-light">Otherwise product images will be used</div>

            <div class="row justify-center q-my-md">
              <multi-image-upload v-model="form.images"></multi-image-upload>
            </div>
          </q-card-section>
          <div class="col-12">
            <product-list
              emit-value
              :value="productMap"
              @newInput="addProduct"
              @rmvInput="rmvProduct"
              title="Products"
              select
              editing
              :paginator="false"
              :query-in="{ _id: { $in: this.lget(this.vendorContext,'products', [])} }"
            ></product-list>
            <q-list separator>
              <q-item v-for="(prod, i) in stateProducts" :key="`prod-${i}`">
                <product-item
                  flat
                  :value="prod"
                >
                  <template v-slot:side>
                    <q-select
                      style="width: 100px"
                      dense
                      label="Currency"
                      :value="lget(form, ['products', i, 'price', 'currency'], 'usd')"
                      @input="changeCurrency(i, ...arguments)"
                      :options="['usd', 'ngn']"
                    ></q-select>
                    <price-picker
                      style-in="width: 120px"
                      input-class="text-xxxs text-mb-xxs text-weight-bold text-right"
                      dense
                      :currency-in="lget(prod, ['price', 'currency'], 'usd')"
                      :value="lget(prod, ['price', 'basePrice'], 0)"
                      @input="changePrice(i, ...arguments)"
                    ></price-picker>
                  </template>
                </product-item>
              </q-item>
            </q-list>
          </div>
        </div>
        <div class="q-py-sm col-12">
          <q-select
            label="Sell As"
            v-model="form.type"
            emit-value
            :options="types"
            option-label="label"
            hint="Sell this group as a package, individual items, or both"
          ></q-select>
          <template v-if="form.type !== 'a-la-carte'">
            <q-select
              label="Currency"
              v-model="form.price.currency"
              :options="['usd', 'ngn']"
            />
            <price-picker :currency-in="lget(form, 'price.currency', 'usd')" v-model="form.price.basePrice"/>
          </template>
          <q-separator class="q-my-md"/>
        </div>
        <div class="col-12 q-my-lg">
          <q-btn label="set availability" icon="mdi-calendar" color="primary">
            <q-popup-proxy>
              <q-card dark class="q-pa-xs">
                <schedule-picker v-model="form.settings.schedule"></schedule-picker>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-end">
        <q-btn outline label="Save" @click="saveProductGroup(form)" color="primary"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {models} from 'feathers-vuex';
  import SchedulePicker from '../../common/atoms/pickers/SchedulePicker';
  import MultiImageUpload from 'components/common/substance/images/MultiImageUpload';
  import ProductList from 'components/products/lists/ProductList';
  import PricePicker from 'components/common/atoms/pickers/PricePicker';
  import {vCheck} from 'src/mixins/ir-validate';
  import ProductItem from 'components/products/card/ProductItem';

  export default {
    name: 'ProductGroupForm',
    mixins: [vCheck],
    components: { ProductItem, PricePicker, ProductList, MultiImageUpload, SchedulePicker },
    props: {
      value: Object
    },
    mounted() {
      if (this.value) this.form = new models.api.CrayvProductGroups(this.value).clone();
      if (this.form?.images?.length) this.adding = false;
    },
    data() {
      return {
        updateValidOnInput: true,
        filterInput: '',
        adding: true,
        form: new models.api.CrayvProductGroups().clone()
      };
    },
    computed: {
      ...mapGetters({ vendorContext: 'vendorContext' }),
      ...mapGetters('crayv-products', { findProducts: 'find' }),
      stateProducts() {
        // return this.lget(this.value, '_fastjoin.p', []);
        let list = this.findProducts({
          query: { _id: { $in: this.productMap } }
        }).data;
        const getPriceObj = (i) => {
          return Object.assign({}, this.lget(this.form, ['products', i]));
        };
        return list.map((a, i) => this.$lmerge(a.clone(), getPriceObj(i)));
      },
      productMap() {
        let list = this.lget(this.form, 'products', []);
        return list.map(a => a.id);
      },
      types() {
        return [
          {
            label: 'a-la-carte',
            description: 'Products sold individually',
            value: 'a-la-carte'
          },
          {
            label: 'Package',
            description: 'Sell as a package',
            value: 'package'
          },
          {
            label: 'Both',
            description: 'Sell a-la-carte or as a package',
            value: 'combo'
          }
        ];
      },
      vCheckForm() {
        return this.form;
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty'] },
          description: { name: 'Description', v: ['notEmpty'] },
          type: { name: 'Type', v: ['notEmpty'] },
        };
      }
    },
    methods: {
      addProduct(val) {
        let obj = { id: val._id, price: val.price };
        this.form.products ? this.form.products.push(obj) : this.form.products = [obj];
      },
      changeCurrency(idx, curr) {
        this.$lset(this.form, ['products', idx, 'price', 'currency'], curr);
      },
      changePrice(idx, price) {
        console.log('change price', idx);
        this.$lset(this.form, ['products', idx, 'price', 'basePrice'], price);
      },
      rmvProduct(val, idx) {
        this.form.products.splice(idx, 1);
      },
      async saveProductGroup(val) {
        val.vendorId = this.$store.state.vendorContext._id;
        let pg = new models.api.CrayvProductGroups(val).clone();
        console.log('saving pgg', pg);
        await pg.save()
          .then(res => {
            this.$emit('input', res);
            console.log('new product group', res);
            this.$q.notify({ message: 'Product Group Saved!', icon: 'mdi-check', color: 'positive' });
          })
          .catch(err => {
            this.$errNotify(err.message);
          });
      },
      newImage(val) {
        if (this.form.images && !this.form.images.includes(val)) {
          this.adding = false;
          this.form.images ? this.form.images.push(val) : this.form.images = [val];
        }
      }
    }
  };
</script>
