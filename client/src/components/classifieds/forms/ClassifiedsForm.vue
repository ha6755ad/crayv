<template>
  <q-card flat class="q-pa-md">
    <div class="t-r" v-if="value">
      <remove-button service="crayv-classifieds" :value="value"></remove-button>
    </div>

    <image-form v-model="form.images" multiple></image-form>

    <div class="q-my-md text-xs text-mb-xs text-weight-bold">{{ form.name ? form.name : 'Add Listing' }}</div>

    <q-input
      :error="$vErrorCheck('name')"
      :error-message="$vErrorMessage('name')"
      v-model="form.name" placeholder="Name Listing"></q-input>


    <q-input
      :error="$vErrorCheck('description')"
      :error-message="$vErrorMessage('description')"
      v-model="form.description" placeholder="Description"
      autogrow filled></q-input>


    <price-picker
      :errorCheck="$vErrorCheck"
      :errorMessage="$vErrorMessage"
      v-model="form.price"/>

    <q-separator dark class="q-my-md"></q-separator>


    <div class="row items-center">
      <q-radio label="Best Offer (obo)" v-model="form.type" val="obo" class="q-mx-xs"></q-radio>
      <q-radio label="First Offer" v-model="form.type" val="first" class="q-mx-xs"></q-radio>
    </div>

    <q-separator dark class="q-my-md"></q-separator>

    <tag-picker service-in="crayv-classifieds" v-model="form.tags"></tag-picker>

    <q-separator dark class="q-my-md"></q-separator>

    <div class="q-pa-md text-xs text-mb-xs text-weight-medium">Location Options</div>

    <q-btn v-if="lget(form, 'location.latitude')" icon="mdi-map-marker" flat color="nice" icon-right="mdi-pencil-box"
           :label="$limitStr(lget(form, 'location.formatted'), 60)" @click="addingAddress = true">
      <q-tooltip>Change</q-tooltip>
    </q-btn>

    <q-slide-transition>
      <address-form
        v-if="addingAddress || !lget(form, 'location.latitude')"
        :value="lget(user, 'addresses')"
        @input="handleAddress"
        @add="$setForm('location', ...arguments)"
        adding
      ></address-form>
    </q-slide-transition>

    <q-separator dark class="q-my-md"></q-separator>

    <template v-if="center">
      <div class="q-pa-md text-xxs text-mb-xxs text-weight-bold">Delivery Options</div>

      <div class="row items-center justify-around">
        <div v-for="(type, i) in boundaryTypes" :key="`boundary-type-${i}`">
          <q-btn @click="changeType(type.value)"
                 :icon="boundaryType === type.value ? 'mdi-checkbox-marked-outline' : 'mdi-checkbox-blank-outline'"
                 :color="boundaryType === type.value ? 'nice' : 'grey-5'" flat :label="type.label">
            <q-tooltip>{{ type.caption }}</q-tooltip>
          </q-btn>
          <div class="__underline bg-nice" :style="boundaryType === type ? {} : {width: 0}"></div>
        </div>
      </div>


      <div style="height: 550px; transition: all .6s; max-height: 95vw; width: 100%;" v-if="boundaryType === 'draw'"
           class="q-pa-sm">
        <!--        <div style="height: 100%; width: 100%">-->
        <draw-boundary
          :markers-in="[center]"
          single-boundary
          v-model="form.boundary"
          :center="center ? center : coordinates ? coordinates : [-111.876183, 40.758701]"
        ></draw-boundary>
        <!--        </div>-->
      </div>

      <q-slide-transition>
        <div v-if="boundaryType === 'radius'" class="q-py-lg q-px-sm">
          <div class="flex justify-center items-center text-xxs text-mb-xxs text-weight-medium">
            <div>Within</div>
            <q-btn-dropdown
              class="q-mx-sm"
              outline
              color="nice"
              :label="km"
            >
              <q-list>
                <q-item v-for="i in 10" :key="`level-${i}`" clickable @click="addRadius(i * 10)">
                  <q-item-section>
                    <q-item-label class="text-center text-xs text-mb-xs text-weight-bold">{{ i * 10 }}km</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <div>km</div>
          </div>
        </div>
      </q-slide-transition>

      <q-slide-transition>
        <div v-if="boundaryType === 'point'" class="q-pa-md text-xs text-mb-xs text-italic">
          No Delivery
        </div>
      </q-slide-transition>

      <div class="q-pa-sm" v-if="boundaryType !== 'point'">
        <q-input
          filled
          :value="dollarString(lget(form, 'price.delivery.basePrice', 0), '', 2)"
          @input="$lset(form, 'price.delivery.basePrice', parseFloat($event))" label="Delivery Fee"
          mask="#.##"
          fill-mask="0"
          reverse-fill-mask
        >
          <template v-slot:prepend>
            <q-icon :name="$getCurrencyIcon(lget(form, 'price.currency'))"></q-icon>
          </template>
        </q-input>
      </div>
    </template>
    <q-separator dark class="q-my-md"></q-separator>

    <div class="q-pa-md row justify-end">
      <q-btn push color="secondary" label="save" icon="mdi-content-save" @click="save"></q-btn>
    </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import RemoveButton from 'components/common/atoms/buttons/RemoveButton';
  import PricePicker from 'components/common/atoms/pickers/PricePicker';
  import TagPicker from 'components/common/atoms/pickers/TagPicker';
  import AddressForm from 'components/family-pod/personal/AddressForm';
  import {mapGetters} from 'vuex';
  import {vCheck} from 'src/mixins/ir-validate';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import DrawBoundary from 'components/utils/mapbox/map/DrawBoundary';

  export default {
    name: 'ClassifiedsForm',
    mixins: [vCheck],
    components: { DrawBoundary, ImageForm, AddressForm, TagPicker, PricePicker, RemoveButton },
    props: {
      value: Object
    },
    mounted() {
      if (this.value){
        Object.assign(this.form, Object.assign({}, this.value));
      } else {
        this.addPoint();
      }
      if (this.lget(this.value, 'boundary.features', []).some(a => a.name)) {
        this.boundaryType = 'draw';
      }
    },
    data() {
      return {
        km: 10,
        addingAddress: true,
        boundaryType: 'point',
        updateValidOnInput: true,
        form: new models.api.CrayvClassifieds().clone(),
        dirty: false
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters({ coordinates: 'coordinates' }),
      center() {
        let lng = this.lget(this.form, 'location.longitude');
        let lat = this.lget(this.form, 'location.latitude');
        if (lng && lat) {
          return [lng, lat];
        } else return null;
      },
      boundaryTypes() {
        return [
          { label: 'Pickup Only', value: 'point', caption: 'Buyers pick up at a single location' },
          { label: 'Radius', value: 'radius', caption: 'Deliver within a distance from your location' },
          { label: 'Draw', value: 'draw', caption: 'Draw custom boundaries' },
        ];
      },
      vCheckForm() {
        return this.form;
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty', 'lt:40'] },
          description: { name: 'Description', v: ['notEmpty'] },
          'price.basePrice': { name: 'Price', v: ['notEmpty'] },
          'price.currency': { name: 'Currency', v: ['notEmpty'] },
          tags: { name: 'Tags', v: ['arrayLength:1'] },
          'location.latitude': { name: 'Location', v: ['notEmpty'] },
          'boundary.featrues': { name: 'Delivery area or location' }, v: ['arrayLength:1']
        };
      }
    },
    methods: {
      pointGeo(val) {
        let point = val ? val : this.coordinates;
        return {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: point
              }
            }
          ]
        };
      },
      addPoint(val) {
        this.form.boundary = this.pointGeo(val);
      },

      addRadius(val) {
        this.km = val;
        let geo = this.$createGeoJSONCircle(this.center, val);
        console.log('add radius', geo);
        if (geo) {
          this.form.boundary = geo;
        } else this.$quickNotify('Error setting radius - try again');
      },
      changeType(val) {
        if (this.form._id) {
          this.$q.dialog({
            title: 'Change Delivery Area Type?',
            message: 'Changing type will remove any existing boundary data',
            ok: { size: 'sm', color: 'positive', label: 'Yes', push: true },
            cancel: { size: 'sm', color: 'negative', label: 'Go Back', flat: true },
          }).onOk(() => {
            this.form.boundary = null;
            this.boundaryType = val;
            if (val === 'point') {
              this.addPoint();
              this.$lset(this.form, 'price.delivery.basePrice', undefined);
            } else if (val === 'radius') {
              this.addRadius(this.km);
            }
          });
        } else {
          this.boundaryType = val;
          if (val === 'point') {
            this.addPoint();
            this.$lset(this.form, 'price.delivery.basePrice', undefined);
          } else if (val === 'radius') {
            this.addRadius(this.km);
          }
        }

      },
      handleAddress(val) {
        this.form.location = val;
        this.$store.dispatch('users/patch', [this.user._id, {
          $addToSet: { addresses: val }
        }]);
        this.addingAddress = false;
        setTimeout(() => {
          this.addPoint(this.center);
        }, 50);
      },
      save() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          console.log('saving', this.form);
          // this.$store.dispatch('crayv-classifieds/patch', [this.form._id, {
          //   boundary: this.form.boundary
          // }])
          this.form.save()
            .then(res => {
              console.log('saved', res);
              this.$emit('input', res);
              this.$successNotify('For Sale!');
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
