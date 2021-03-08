<template>
  <q-card :flat="flat" :dark="dark" style="width: 100%">
    <div class="flex items-center t-r">
      <q-btn v-if="editing" size="sm" flat dense icon="mdi-pencil-box" @click="editDialog = true"></q-btn>
      <q-btn v-if="active" size="sm" flat dense icon="mdi-checkbox-marked-outline" color="positive"></q-btn>
    </div>

    <q-item clickable @click="$emit('input', value)">
      <q-item-section avatar>
        <default-avatar :value="value" avatar-path="images" square></default-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-xxs text-mb-xs text-weight-medium">{{ lget(value, 'name', 'Untitled') }}
        </q-item-label>
        <q-item-label class="text-xxxs text-mb-xxx" caption>
          <div class="__one-liner">
            {{ lget(value, 'description', 'Untitled') }}
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <slot name="side">
          <div style="display: flex; flex-direction: column; justify-content: flex-end" v-if="lget(value, 'type', 'a-la-carte') !== 'a-la-carte'">
            <q-icon :name="$getCurrencyIcon(lget(value, 'price.currency'))"/>
            <div class="text-xs text-mb-sm text-green text-weight-bold" v-html="priceDisplay"></div>
          </div>
        </slot>
      </q-item-section>
    </q-item>

    <q-dialog position="right" :maximized="$q.screen.lt.sm" transition-hide="slide-right" transition-show="slide-left"
              v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <product-group-form @input="editDialog = false" :value="value"></product-group-form>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import ProductGroupForm from 'components/product-groups/forms/ProductGroupForm';

  export default {
    name: 'ProductGroupItem',
    components: { ProductGroupForm, DefaultAvatar },
    props: {
      active: Boolean,
      value: Object,
      flat: Boolean,
      dark: Boolean,
      editing: Boolean
    },
    data() {
      return {
        editDialog: false
      };
    },
    computed: {
      product() {
        return this.value;
      },
      totalPrice() {
        return this.lget(this.product, 'priceObj.total', this.lget(this.product, 'price.basePrice', 0));
      },
      basePrice() {
        return this.lget(this.product, 'price.basePrice', 0);
      },
      priceDisplay() {
        let base = this.basePrice;
        let total = this.totalPrice;
        let exp = this.lget(this.product, 'priceObj.exp', null);
        if (base > total) {
          return `<div><div><span class="text-grey-6" style="text-decoration: line-through">${this.$dollarString(base, '', 2)}</span> <span>${this.$dollarString(total, '', 2)}</span></div><div class="text-xxs text-mb-xxs absolute-bottom text-weight-light text-primary q-pa-sm">${exp ? 'Expires: ' + this.getDateFormat(exp, 'ddd MMM-DD YYYY') : ''}</div></div>`;
        } else return `<span>${this.$dollarString(total, '', 2)}</span>`;
      },
    }
  };
</script>
