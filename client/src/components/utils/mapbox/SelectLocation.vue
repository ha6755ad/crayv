<template>
  <div style="height: 100%; width: 100%; position: relative">
    <div class="map_list" style="z-index: 10">
      <div class=" row q-px-md">
        <div class="__maptype_menu" style="position: relative">
          <q-btn flat size="sm" :icon="locationType ? locTypes.filter(a => a.name === locationType)[0].icon : ''"
                 :icon-right="'mdi-menu-down'"
                 :label="locationType ? locationType : 'Select Type'">
            <q-menu>
              <q-list>
                <q-item clickable v-for="type in locTypes" :key="type.name" @click="selectType(type)">
                  <q-btn flat size="sm" :v-ripple="false" :icon="type.icon" :label="type.name"/>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div class="tool_text" @click="listOn = !listOn">
          <p v-if="features.length === 1" @click="listOn = !listOn" style="cursor: pointer" class="address_box">
            {{addresses && addresses.length ? addresses[0].formatted : ''}}<br></p>
          <p v-else-if="features.length > 1" style="cursor: pointer" class="address_box">{{features.length +
            ' Locations'}}</p>
        </div>
        <q-btn flat size="sm" @click="adding = !adding" v-show="addresses && addresses.length !== 0" label="new"/>
      </div>
      <div class="row q-px-md">
        <div class="list_popup">
          <!--          <v-toolbar color="#68a4eb" dark dense>-->
          <!--            <v-toolbar-title>Event Location List</v-toolbar-title>-->
          <!--          </v-toolbar>-->
          <div class="preview_item" v-if="features.length === 0">No event location added</div>
          <div class="address_item" v-for="(feature, index) in features" :key="index">
            <div class="address_inside">
              <p style="font-weight: 500" v-if="feature.addresses && feature.addresses.length">
                {{feature.addresses[0].formatted}}</p>
              <p style="font-weight: 300">Location participating in&nbsp;<span
                :style="{fontWeight: 600, color: scheduleCalc(index) === 'ALL' ? 'var(--primary-1-color)' : 'var(--secondary-2-color)'}">{{scheduleCalc(index)}}</span>&nbsp;items
                on the event schedule&nbsp;<span><q-icon @click="editSchedule(index)" size="15px"
                                                         style="cursor: pointer" name="mdi-pencil"/></span>
              </p>
            </div>
            <q-btn round flat @click="$emit('deleteAddress', index)" size="sm"
                   style="position: absolute; top: 2px; right: 2px" icon="mdi-delete"/>
          </div>
        </div>
      </div>
      <map-address
        @input="addressInput"
        height="100%"
        width="100%"
        :feature-list="features"
      ></map-address>
      <div class="overlay" v-show="scheduleDialog" v-if="editing && editing.location">
        <div class="sm_dialog">
          <q-card>
            <q-btn round flat icon="mdi-close" @click="closeSchedule"
                   style="position: absolute; top: 2px; right: 2px;"/>
            <q-list>
              <q-item dense>
                <q-item-section>
                  <q-item-label>
                    Schedule Items for {{editing ? editing.location.formatted : 'unknown address'}}
                  </q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-for="(item, i) in eventIn.schedule.items" :key="i" @click="changeScheduleItem(item)">
                <q-item-section avatar>
                  <q-icon color="secondary" v-if="editing && editing.schedule_items.includes(item.uuid)"
                          name="mdi-check-box-outline">
                  </q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{item.name}}
                  </q-item-label>
                  <q-item-label caption>
                    {{startFormat(item.starts)}}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment';
  import MapAddress from './MapAddress';

  const common = require('../../../store/schemas/common');

  export default {
    name: 'SelectLocation',
    components: {MapAddress},
    props: {
      hide_details: Boolean,
      eventIn: Object,
      addressList: {
        type: Array,
        default: function () {
          return [];
        }
      },
    },
    created() {
      this.resetForm();
    },
    mounted(){
      this.form.allowFeatures = ['Point'];
    },
    data() {
      return {
        locationType: 'Single',
        editing: {},
        editIndex: -1,
        menuOn: false,
        listOn: false,
        form: {},
        locTypes: [{name: 'Single', value: 'Point', icon: 'mdi-map-marker'}, {
          name: 'Multiple', value: 'Point',
          icon: 'mdi-map-marker-multiple'
        }, {name: 'Boundary', value: 'Polygon', icon: 'mdi-select-marker'}
        ],
        scheduleDialog: false,
      };
    },
    computed: {
      addresses() {
        if (this.features && this.features.length && this.features[0].addresses && this.features[0].addresses.length) {
          return this.features[0].addresses;
        } else return [];
      },
      features() {
        return this.form.features ? this.form.features : [];
      },
      scheduleList() {
        return this.editing ? this.eventIn.schedule.items.filter(a => this.editing.schedule_items.includes(a.uuid)) : [];
      },
    },

    methods: {
      startFormat(item) {
        return moment(item).format('ddd, DD MMM-YYYY');
      },
      addressInput(val) {
        if (this.locationType) {
          if (!this.form.features && this.form.features[0].geometry.coordinates) this.resetForm();
          if (this.locationType === 'Single') {
            this.form.features = [
              {
                geometry: {
                  type: 'Point',
                  coordinates: [val.longitude, val.latitude]
                },
                properties: {},
                addresses: [val]
              }
            ];
            this.emitAddress();
          } else if (this.locationType === 'Multiple') {
            this.form.features.push({
              geometry: {
                type: 'Point',
                coordinates: [val.longitude, val.latitude]
              },
              properties: {},
              addresses: [val]
            });
            this.emitAddress();
          }
        } else this.$q.notify({message: 'Select a location type', color: 'primary'});
      },
      emitAddress() {
        if (this.eventIn?.schedule?.items) {
          this.eventIn.schedule.items.forEach(a => {
            this.form.features.forEach(f => {
              f.schedule_items ? f.schedule_items.push(a.uuid) : f.schedule_items = [a.uuid];
            });
          });
        }
        this.$emit('input', this.form, -1);
      },
      selectType(type) {
        // All locations saved as GeoJSON data structure 'FeatureCollection' set allowFeatures to make it easier to know what type of features to expect
        if (type.value === 'Polygon') this.form.allowFeatures = ['Point', 'Polygon'];
        else this.form.allowFeatures = ['Point'];
        this.locationType = type.name;
        this.menuOn = false;
      },
      changeScheduleItem(item) {
        if (this.editing.schedule_items.includes(item.uuid)) {
          let idx = this.editing.schedule_items.indexOf(item.uuid);
          this.editing.schedule_items.splice(idx, 1);
        } else this.editing.schedule_items.push(item.uuid);
        this.$emit('input', this.editing, this.editIndex);
      },
      editSchedule(idx) {
        this.editIndex = idx;
        this.scheduleDialog = !this.scheduleDialog;
        this.editing = Object.assign({}, this.addressList[idx]);
      },
      closeSchedule() {
        this.editing = Object.assign({}, {});
        this.editIndex = -1;
        this.scheduleDialog = false;
      },
      scheduleCalc(index) {
        if (this.eventIn && this.addressList && this.addressList.length) {
          let all = this.eventIn.schedule.items.length;
          let curr = this.addressList[index].schedule_items.length;
          if (all > curr) {
            return curr;
          } else return 'ALL';
        } else return 'NO';
      },
      resetForm() {
        this.form = Object.assign({}, common.GeoLocation);
      }
    }
  };
</script>

<style scoped lang="scss">
  .map_list {
    /*top: 10px;*/
    height: auto;
    width: 100%;
    padding-top: 15px;
    border-radius: 2px;
    z-index: 4;
    display: flex;
    position: relative;
    flex-direction: column;
    transition: height .3s ease-out;
  }

  .map_tool {
    padding: 10px;
    height: 50px;
    position: relative;
    /*transform: translate(0, 15px);*/
    width: 100%;
    border-radius: 2px;
    font-weight: bold;
    color: var(--accent-2-color);
    /*background: #eeeeee;*/
    /*box-shadow: 0 2px 5px #757575;*/
    display: flex;
    align-items: center;

    .__maptype_menu {
    }

  }

  .loc_title {
    font-size: 1.2rem;
  }

  .tool_text {
    align-self: center;
    padding: 1px;
    font-weight: 400;
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .tool_text p {
    margin: 0;
    cursor: pointer;
  }

  .list_popup {
    /*position: absolute;*/
    margin-top: 10px;
    padding: 5px 0 5px 0;
    /*left: 0;*/
    width: 100%;
    border-radius: 5px;
    background-color: white;
    color: var(--heavy-text-color);
    display: flex;
    flex-direction: column;
    max-height: 400px;
    overflow-y: scroll;
  }

  .preview_item {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 15px;
    width: 100%;
    position: relative;
  }

  .address_item {
    display: flex;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 15px;
    width: 100%;
    position: relative;
    box-shadow: 0 1px 3px #9e9e9e;
  }

  .address_item p {
    margin-bottom: -5px;
  }
</style>
