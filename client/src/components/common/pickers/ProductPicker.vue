<template>
  <q-select :options="optionsIn.filter(a => a[optionName].toLowerCase().indexOf(this.filterInput.toLowerCase()) > -1)" :label="$attrs.label" :hint="$attrs.hint"
            :multiple="$attrs.multiple" :value="form" use-input
            @input-value="val => filterInput = val" clearable @clear="filterInput = ''" :disable="$attrs.disable">
    <template v-slot:selected-item="scope">
      <q-chip dark removable @remove="$attrs.multiple ? form.splice(scope.index, 1) : form = Object.assign({}, productModel)">
        <q-avatar>
          <img :src="getAvatar(getFullProduct(scope.opt), 'images', 'small', 0)">
        </q-avatar>
        {{getFullProduct(scope.opt) ? getFullProduct(scope.opt).name : ''}}
      </q-chip>
    </template>
    <template v-slot:option="scope">
      <q-item clickable @click="addProduct(scope.opt, scope.index)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="getAvatar(scope.opt, 'images', 'small', 0)">
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{scope.opt[optionName]}}</q-item-label>
          <q-item-label caption>
            {{scope.opt[optionSubtitle]}}
          </q-item-label>
        </q-item-section>
        <q-item-section side v-if="optionPrice">
          <p class="text-green text-weight-bold">{{dollarString(scope.opt.price.basePrice, '$')}}</p>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
  export default {
    name: 'ProductPicker',
    props: {
      optionsIn: Array,
      optionName: String,
      optionSubtitle: String,
      optionPrice: String,
      optionValue: String,
      optionListValue: String,
      productModel: Object,
      value: [Object, Array]
    },
    mounted() {
      if (this.$attrs.multiple) this.form = [];
      else this.form = {};
      if (this.value) this.$attrs.multiple ? this.form = this.value : this.form = Object.assign({}, this.value);
    },
    data() {
      return {
        filterInput: '',
        form: null
      };
    },
    watch: {

    },
    methods: {
      getFullProduct(val) {
        // console.log('getting val', val)
        let valU = this.optionValue ? val[this.optionValue] : val;
        let list = Array.from(new Set(this.optionsIn));
        return list.filter(a => a[this.optionListValue] === valU)[0];
      },
      addProduct(product, index) {
        console.log('adding product', product, index);
        if (this.$attrs.multiple) {
          if (!this.form || !this.form.map(a => a[this.optionValue]).includes(product[this.optionListValue])) {
            let obj = Object.assign({}, this.productModel);
            obj[this.optionValue] = product[this.optionListValue];
            console.log('pushing obj', this.form.map(a => a[this.optionValue]), product[this.optionListValue], obj, this.optionValue, this.optionListValue);
            console.log('pushing obj', obj, this.form);
            this.form.push(obj);
          } else this.form.splice(index, 1);
        } else {
          let obj = Object.assign({}, this.productModel);
          obj[this.optionValue] = product[this.optionListValue];
          this.form = Object.assign({}, obj);
        }
        setTimeout(() => {
          this.$emit('input', this.form);
        }, 300);
      },
    }
  };
</script>
