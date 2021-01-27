<template>
  <div>
    <q-btn round flat :color="value.accepted ? 'positive' : 'nice'"
           :icon="value.accepted ? 'mdi-checkbox-marked-circle-outline' : 'mdi-dots-vertical'">
      <q-menu>
        <q-card>
          <q-list dense>
            <q-item
              dense
              clickable
              @click="acceptOffer"
              v-if="isSubjectOwner && acceptable"
            >
              <q-item-section avatar>
                <q-btn color="positive" round flat size="sm" icon="mdi-checkbox-marked-circle-outline"></q-btn>
              </q-item-section>
              <q-item-section>
                <q-item-label>Accept</q-item-label>
              </q-item-section>
            </q-item>
            <q-item
              dense
              clickable
              @click="editDialog = true"
              v-if="canEdit"
            >
              <q-item-section avatar>
                <q-btn round flat size="sm" icon="mdi-pencil-box" color="dark"></q-btn>
              </q-item-section>
              <q-item-section>
                <q-item-label>Edit</q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="canEdit || (isSubjectOwner && acceptable)" clickable>
              <q-item-section avatar>
                <remove-button
                  color="negative"
                  dense
                  size="sm"
                  title="Remove Offer?"
                  service="crayv-offers"
                  :value="value"
                ></remove-button>
              </q-item-section>
              <q-item-section>
                <q-item-label>Remove</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </q-menu>
    </q-btn>
    <q-dialog v-model="editDialog">
      <q-card style="width: 600px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="editDialog = false"/>
        <offer-form :value="value"></offer-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import RemoveButton from 'components/common/atoms/buttons/RemoveButton';
  import {mapGetters, mapState} from 'vuex';
  import OfferForm from 'components/offers/forms/OfferForm';

  export default {
    name: 'OfferActions',
    components: { OfferForm, RemoveButton },
    props: {
      value: Object,
      subject: Object
    },
    data() {
      return {
        editDialog: false
      };
    },
    computed: {
      ...mapState('currency', { currencies: 'national_currencies' }),
      ...mapGetters('auth', { stateUser: 'user' }),
      canEdit() {
        return this.lget(this.value, 'createdBy') === this.lget(this.user, '_id', 1) && this.acceptable;
      },
      acceptable() {
        return !this.lget(this.subject, 'sold') && (!this.lget(this.value, 'accepted') || this.lget(this.subject, 'type') === 'obo');
      },
      isSubjectOwner() {
        return this.lget(this.user, '_id') === this.lget(this.subject, 'createdBy');
      },
    },
    methods: {
      acceptOffer() {
        this.$q.dialog({
          title: 'Accept Offer?',
          message: `${this.lget(this.subject.type === 'obo') ? 'This is a \'Best Offer\' listing so others will still be able to bid until it\'s marked sold.' : 'Accepting an offer on a \'First Offer\' listing means you cannot accept any new offers unless this one cancels.'}`,
          ok: {
            size: 'sm',
            label: 'accept',
            color: 'positive',
            push: true
          },
          cancel: {
            size: 'sm',
            label: 'go back',
            color: 'negative',
            flat: true
          }
        })
          .onOk(() => {
            this.$store.dispatch('crayv-offers/patch', [this.value._id, {
              accepted: new Date()
            }])
              .then(() => {
                this.$successNotify('Offer Accepted');
              })
              .catch(err => {
                this.$errNotify(err.message);
              });
          });
      }
    }
  };
</script>

<style scoped>

</style>
