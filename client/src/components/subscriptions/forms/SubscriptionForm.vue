<template>
  <q-card flat style="height: 100%; max-height: 100vh; width: 100%">
    <q-card-section>
      <div class="text-sm text-mb-sm text-weight-light">{{form && form._id ? 'Edit' : 'Add'}} Subscription</div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-center">
        <div class="col-12 q-gutter-md">
          <q-input label="Name Subscription" v-model="form.name"/>
          <q-input type="textarea" filled label="Description" v-model="form.description"/>

          <q-separator/>

          <div style="border-radius: 5px; border: .3px solid rgba(0,0,0,.4)" class="q-pa-md text-xxs text-mb-xs">Apply
            subscription to product or product lineup. If you want to associate with multiple products, group them into
            a product lineup first; this will allow dynamic changing of the lineup without disrupting the subscription
          </div>
          <div class="row justify-around">
            <q-checkbox @input="form.product = productObj" color="primary" keep-color label="Product Lineup"
                        v-model="form.product.productModel" true-value="product-groups" false-value="products"/>
            <q-checkbox @input="form.product = productObj" color="accent" keep-color label="Product"
                        v-model="form.product.productModel" true-value="products" false-value="product-groups"/>
          </div>
          <div>
            <product-picker
              :product-model="productObj"
              :options-in="form.product.productModel === 'products' ? stateProducts : form.product.productModel === 'product-groups' ? stateLineups : []"
              option-name="name"
              option-value="id"
              :option-price="form.product.productModel === 'products' ? 'price.basePrice' : null"
              option-subtitle="description"
              v-model="form.product"
              option-list-value="_id"
              :label="`Choose ${form.product.productModel === 'products' ? 'Product' : form.product.productModel === 'product-groups' ? 'Product Lineup' : 'Product or product lineup first'}`"
              :disable="!['products', 'product-groups'].includes(form.product.productModel)"
            ></product-picker>
          </div>
          <q-separator/>
          <div v-for="(opt, i) in form.options" :key="`opt-${i}`">
            <div class="col-12 text-xxs text-mb-sm text-weight-light">
              <q-card class="q-pa-sm">
                <q-btn class="t-r" color="red" size="sm" round flat icon="mdi-delete" @click="removeOption(i)"/>
                <div class="col-12 q-gutter-sm">
                  <div>Pricing Option</div>
                  <div class="pointer">
                    Name: <span class="text-weight-bold text-blue-10">{{opt.name ? opt.name : 'n/a'}} <q-icon
                    name="mdi-pencil-box" class="q-mx-sm"/></span>
                    <q-popup-edit :value="opt.name">
                      <q-input label="Price Option Name" hint="eg: 'weekly', 'monthly', 'annually'" v-model="opt.name"/>
                    </q-popup-edit>
                  </div>
                  <q-separator/>
                  <div class="pointer">
                    Price: <span class="text-weight-bold text-blue-10">{{opt.price && opt.price.basePrice ? dollarString(opt.price.basePrice, '$') : 'n/a'}} <q-icon
                    name="mdi-pencil-box" class="q-mx-sm"/></span>
                    <q-popup-edit :value="opt.price">
                      <price-picker v-model="opt.price"/>
                    </q-popup-edit>
                  </div>
                  <q-separator/>
                  <div class="pointer" @click="ruleDialog = i">
                    Rule: <span class="text-weight-bold text-blue-10">{{ruleDisplay[i]}} <q-icon name="mdi-pencil-box"
                                                                                                 class="q-mx-sm"/></span>
                  </div>
                  <q-dialog :value="ruleDialog === i" @input="(val) => ruleDialog = !val ? -1 : i">
                    <q-card class="q-pa-md" style="width: 500px; max-width: 100vw">
                      <r-rule-form no-display v-model="opt.rule" @input="ruleDialog = false"
                                   @display="setDisplay(i, ...arguments)"/>
                    </q-card>
                  </q-dialog>
                </div>
              </q-card>
            </div>
          </div>
          <q-btn icon="mdi-plus" color="secondary"
                 label="add pricing option" @click="form.options.push(optionModel)">
          </q-btn>
        </div>
      </div>
    </q-card-section>
    <q-card-section>
      <div class="row justify-end">
        <q-btn @click="saveSubscription(form)" label="save" color="primary"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {models} from 'feathers-vuex';
  import PricePicker from 'components/common/pickers/PricePicker';
  import RRuleForm from 'components/common/recurrance/RRuleForm';
  import ProductPicker from 'components/common/pickers/ProductPicker';

  export default {
    name: 'SubscriptionForm',
    components: { ProductPicker, RRuleForm, PricePicker },
    props: {
      subscriptionIn: Object
    },
    mounted() {
      if (this.subscriptionIn) this.form = new models.api.Subscriptions(this.subscriptionIn).clone();
    },
    data() {
      return {
        ruleDialog: -1,
        ruleDisplay: ['n/a'],
        form: new models.api.Subscriptions().clone(),
        optionModel: new models.api.Subscriptions().clone().options[0]
      };
    },
    computed: {
      ...mapGetters('products', { findProducts: 'find' }),
      ...mapGetters('product-groups', { findLineups: 'find' }),
      productObj() {
        return { id: null, productModel: this.form.product.productModel };
      },
      stateProducts() {
        return this.findProducts({
          query: {
            vendor: { vendorId: { $in: this.$store.state.vendorContext._id } }
          }
        }).data;
      },
      stateLineups() {
        return this.findLineups({
          query: {
            vendor: { vendorId: { $in: this.$store.state.vendorContext._id } }
          }
        }).data;
      }
    },
    methods: {
      async saveSubscription(val) {
        let s = new models.api.Subscriptions(val).clone();
        console.log('saving', s);
        await s.save()
          .then(() => this.$q.notify({ message: 'You are ready to sign people up', color: 'positive' }))
          .catch(err => this.$errNotify(err.message));
      },
      setDisplay(i, val) {
        console.log('got str', i, val);
        this.ruleDisplay[i] = val;
      },
      removeOption(i) {
        this.$q.dialog({
          cancel: true,
          message: 'Remove ' + this.form.options[i].name + ' from pricing options'
        }).onOk(() => {
          this.form.options.splice(i, 1);
        });
      }
    }
  };
</script>
