<template>
  <q-card :flat="flat" style="width: 100%">
    <div class="flex items-center t-r">
    <q-btn v-if="active" icon="mdi-checkbox-marked-outline" color="positive" dense flat size="sm"></q-btn>
      <q-btn v-if="editing" icon="mdi-pencil-box" size="sm" dense flat @click="editDialog = true"></q-btn>
      <q-btn v-if="closeable" icon="mdi-close" size="sm" dense flat @click="$emit('close')"
      ></q-btn>
    </div>
    <q-item clickable @click="$emit('input', value)">
      <q-item-section avatar>
        <default-avatar :value="value" avatar-path="images">
          <template v-slot:menu>
            <q-menu>
              <q-card class="bg-transparent" flat style="height: 210px; width: 210px; border-radius: 10px">
                <product-variant-card :value="value"></product-variant-card>
              </q-card>
            </q-menu>
          </template>
        </default-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label :class="titleClass">
          {{ lget(value, 'name') }}
          <q-tooltip>{{ lget(value, 'name') }}</q-tooltip>
        </q-item-label>
        <q-item-label :class="descriptionClass">
          {{ lget(value, 'description') }}
          <q-tooltip>{{ lget(value, 'description') }}</q-tooltip>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <div style="display: flex; flex-direction: column; justify-content: flex-end">
          <q-icon :name="$getCurrencyIcon(lget(value, 'price.currency'))"/>
          <div class="text-xs text-mb-sm text-green text-weight-bold" v-html="priceDisplay"></div>
        </div>
      </q-item-section>

    </q-item>

    <q-dialog v-model="editDialog">
      <q-card style="width: 500px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <product-variant-form @input="variantInput" :value="value"></product-variant-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import ProductVariantForm from 'components/products/forms/ProductVariantForm';
  import ProductVariantCard from 'components/products/card/ProductVariantCard';

  export default {
    name: 'ProductVariantItem',
    components: { ProductVariantCard, ProductVariantForm, DefaultAvatar },
    props: {
      closeable: Boolean,
      editing: Boolean,
      flat: Boolean,
      active: Boolean,
      value: Object,
      styleIn: [Object, String],
      titleClass: {
        type: String,
        default: 'text-xxs text-mb-xs text-weight-medium __one-liner'
      },
      descriptionClass: {
        type: String,
        default: 'text-xxxs text-mb-xxs caption __one-liner'
      },
    },
    data(){
      return {
        editDialog: false
      };
    },
    computed: {
      priceDisplay() {
        let base = this.lget(this.value, 'price.basePrice');
        return `<span>${this.$dollarString(base, '', 2)}</span>`;
      },
    },
    methods: {
      variantInput(val){
        this.editDialog = false;
        this.$emit('input', val);
      }
    }
  };
</script>
