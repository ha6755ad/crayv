<template>
  <q-card>
    <q-toolbar :class="`bg-accent text-${$getTextColor('--q-color-accent')}`">
      <div class="text-xs text-mb-xs text-weight-bold">{{form && form._id ? 'Edit' : 'Add'}} Product Group</div>
    </q-toolbar>
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-12 q-gutter-sm">
          <q-input label="Product Group Name" v-model="form.name"/>
          <q-input type="textarea" filled label="Description" v-model="form.description"/>
        <q-card-section>
          <div class="row text-xxs text-mb-xxs text-weight-medium">Add Cover Images</div>
          <div class="row text-xxs text-mb-xxs text-weight-light">Otherwise product images will be used</div>

          <div class="row justify-center q-my-md">
            <multi-image-upload v-model="form.images"></multi-image-upload>
          </div>
        </q-card-section>
          <div class="col-12">
            <div class="row text-xxs text-mb-xxs text-weight-medium">Products</div>
            <product-picker
              label="Choose Products"
              option-price="[price][basePrice]"
              option-subtitle="description"
              :options-in="stateProducts"
              option-value="productId"
              option-list-value="_id"
              option-name="name"
              v-model="form.products"
              :productModel="productModel"
              :multiple="true"
            ></product-picker>
          </div>
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
  import ProductPicker from '../../common/atoms/pickers/ProductPicker';
  import MultiImageUpload from 'components/common/substance/images/MultiImageUpload';

  export default {
    name: 'ProductGroupForm',
    components: { MultiImageUpload, ProductPicker, SchedulePicker },
    props: {
      value: Object
    },
    mounted() {
      if (this.value) this.form = new models.api.CrayvProductGroups(this.value).clone();
      if (this.form?.images?.length) this.adding = false;
    },
    data() {
      return {
        filterInput: '',
        adding: true,
        form: new models.api.CrayvProductGroups().clone()
      };
    },
    computed: {
      ...mapGetters('crayv-products', {
        findProducts: 'find'
      }),
      productModel(){
        return { productId: '', price: {} };
      },
      stateProducts() {
        return this.findProducts().data;
      }
    },
    methods: {
      // filterFn (val, update) {
      //   if (val === '') {
      //     update(() => {
      //       this.productFilter = this.stateProducts
      //
      //       // with Quasar v1.7.4+
      //       // here you have access to "ref" which
      //       // is the Vue reference of the QSelect
      //     })
      //     return
      //   }
      //
      //   update(() => {
      //     const needle = val.toLowerCase()
      //     this.productFilter = this.stateProducts.map(a => a.name).filter(v => v.toLowerCase().indexOf(needle) > -1)
      //
      //   })
      // },
      async saveProductGroup(val) {
        val.vendorId = this.$store.state.vendorContext._id;
        let pg = new models.api.CrayvProductGroups(val).clone();
        await pg.save()
          .then(() => {
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
