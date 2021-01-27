<template>
  <q-card flat class="q-pa-md">
    <div class="text-xxs text-mb-xxs text-weight-bold">Offer for {{ lget(subject, 'name', 'Untitled') }}</div>
    <price-picker label="Offer Amount" v-model="form.price"></price-picker>
    <emoji-input :input-attrs="inputAttrs" v-model="form.content"></emoji-input>
    <div class="q-pa-md row justify-end">
      <q-btn push color="nice" label="Submit Offer" icon="mdi-check" @click="save"></q-btn>
    </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import PricePicker from 'components/common/atoms/pickers/PricePicker';
  import EmojiInput from 'components/common/atoms/messaging/EmojiInput';
  import {vCheck} from 'src/mixins/ir-validate';

  export default {
    name: 'OfferForm',
    mixins: [vCheck],
    components: { EmojiInput, PricePicker },
    props: {
      value: Object,
      subject: Object,
      subjectModel: String
    },
    mounted() {
      if (this.value) Object.assign(this.form, Object.assign({}, this.value));
      if (this.subject) this.form.price = this.subject.price;
    },
    data() {
      return {
        form: new models.api.CrayvOffers().clone()
      };
    },
    computed: {
      inputAttrs(){
        return {
          type: 'textarea',
          filled: true,
          placeholder: 'Offer Message'
        };
      },
      vCheckForm(){
        return Object.assign({}, this.form);
      },
      validCheck() {
        return {
          'price.basePrice': {
            name: 'Offer Amount',
            v: ['notEmpty']
          },
          'price.currency': {
            name: 'Currency',
            v: ['notEmpty']
          }
        };
      }
    },
    methods: {
      save() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          this.form.subject = this.subject._id;
          this.form.subjectModel = this.subjectModel;
          this.form.save()
            .then(res => {
              this.$successNotify('Offer Submitted!');
              this.$emit('input', res);
            })
            .catch(err => {
              this.$errNotify(err.message);
            });
        }
      }
    }
  };
</script>

<style scoped>

</style>
