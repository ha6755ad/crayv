<template>
  <q-select
    :label="$attrs.label ? $attrs.label : 'Choose Channels'"
    :multiple="$attrs.multiple"
    v-model="model"
    use-input
    :options="stateChannels.filter(a => a.name.toLowerCase().indexOf(search.toLowerCase()) > -1)"
    @input-value="(val) => search = val"
    clearable
    :emit-value="emitValue"
    options-selected-class="text-primary"
    option-value="_id"
    @input="handleInput"
    @clear="$attrs.multiple ? model = [] : model = {}"
    :style="$attrs.style"
    outlined
  >
    <template v-slot:prepend><q-icon name="mdi-image-filter-tilt-shift"/></template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-italic text-grey">
          No Channels found
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:before-options>
      <q-item dense>
        <q-item-section>
          <q-item-label caption>Channels By Community</q-item-label>
        </q-item-section>
      </q-item>
      <template v-if="!$attrs.noSelectAll">
        <template v-if="(!model || model.length !== stateChannels.length)">
          <q-item clickable @click="model = Array.from(new Set(stateChannels.map(a => a._id)))">
            <q-item-section avatar>
              <q-btn size="sm" round flat>
                <q-icon size="30px" name="mdi-checkbox-blank-outline"/>
              </q-btn>
            </q-item-section>
            <q-item-section>
              <q-item-label>Select All</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator/>
        </template>
        <template v-else>
          <q-item clickable @click="model = []">
            <q-item-section avatar>
              <q-btn size="sm" round flat>
                <q-icon size="30px" name="mdi-checkbox-marked-outline" color="green"/>
              </q-btn>
            </q-item-section>
            <q-item-section>
              <q-item-label>Un-select All</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator/>
        </template>
      </template>
    </template>
    <template v-slot:selected-item="scope">
      <q-chip dark removable @remove="removeItem(scope.opt)">
        <template v-slot:default>
          <q-avatar>
            <img :src="getAvatar(getFullItem(scope.opt), 'avatar', 'small')">
          </q-avatar>
          {{getSelectItemLabel(scope.opt, stateChannels, '_id', 'name')}}
        </template>
      </q-chip>
    </template>

    <template v-slot:option="scope">
      <template v-if="scope.index === 0">
        <q-expansion-item style="width: 100%" :default-opened="groupsIn.length === 1"
                          v-for="(comm, i) in groupsIn"
                          :key="`comm-${i}`">
          <template v-slot:header>
            <q-item style="width: 100%; overflow: hidden">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="getAvatar(comm, 'avatar', 'small')">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{comm.name}}</q-item-label>
                <q-item-label caption>
                  {{comm.description}}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template v-if="comm.channels && comm.channels.length">
          <q-item clickable @click="toggleChannel(channel)" v-for="(channel, idx) in comm.channels"
                  :key="`channel-${idx}`">
            <q-item-section avatar>
              <q-avatar>
                <img :src="getAvatar(getFullItem(channel), 'avatar', 'small')">
              </q-avatar>
            </q-item-section>
            <q-item-section :class="isSelected(channel) ? 'text-primary' : ''">
              <q-item-label>{{getFullItem(channel, 'name')}}</q-item-label>
              <q-item-label caption style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
                {{getFullItem(channel, 'description')}}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <div v-show="isSelected(channel)" class="text-primary text-uppercase text-0-7">Selected</div>
            </q-item-section>
          </q-item>
          </template>
          <template v-else>
            <q-item>
              <q-item-section class="text-italic text-grey">
                No Channels Found
              </q-item-section>
            </q-item>
          </template>
        </q-expansion-item>
        <q-separator/>
      </template>
    </template>

  </q-select>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: 'ChannelPicker',
    props: {
      emitValue: {
        type: Boolean,
        default: true
      },
      groupsIn: Array,
      value: [Array, Object]
    },
    mounted() {
      setTimeout(() => {
        this.loadNeededChannels();
      }, 500);
    },
    data() {
      return {
        search: '',
        model: null
      };
    },
    watch: {
      value: {
        immediate: true,
        handler(newVal) {
          this.model = newVal;
        }
      }
    },
    computed: {
      ...mapGetters('channels', { findChannels: 'find' }),
      stateChannels() {
        let channelList = this.$flattenArray(this.groupsIn.map(c => c.channels));
        return this.findChannels({
          query: {
            _id: { $in: channelList }
          }
        }).data;
      }
    },
    methods: {
      ...mapActions('channels', {
        loadChannels: 'find'
      }),
      toggleChannel(channel) {
        if (this.$attrs.multiple) {
          if (typeof this.model === 'undefined' || !this.model?.includes(channel)) {
            this.model ? this.model.push(channel) : this.model = [channel];
          } else this.model.splice(this.model.indexOf(channel), 1);
        } else {
          this.model = channel;
        }
      },
      loadNeededChannels() {
        let alreadyLoaded = this.stateChannels ? this.stateChannels.map(a => a._id) : [];
        let channelList = this.$flattenArray(this.groupsIn.map(c => c.channels)).filter(a => !alreadyLoaded.includes(a));
        this.loadChannels({
          query: {
            _id: {
              $in: channelList
            }
          }
        });
      },
      isSelected(opt, useId) {
        if (this.model) {
          if (this.emitValue) {
            if (this.$attrs.multiple) return this.model.includes(useId ? opt._id : opt);
            else return this.model === useId ? opt._id : opt;
          } else {
            if (this.$attrs.multiple) return this.model.map(a => a._id).includes(useId ? opt._id : opt);
            else return this.model._id === useId ? opt._id : opt;
          }
        } else return false;
      },
      getFullItem(opt, prop) {
        // console.log('getting full item', opt, prop, this.emitValue);
        if (this.emitValue) {
          let fl = this.stateChannels.filter(a => a._id === opt);
          if (fl?.length) return !prop ? fl[0] : fl[0][prop];
          else return {};
        } else return !prop ? opt : opt[prop];
      }
      ,
      removeItem(item) {
        if (this.$attrs.multiple) this.model.splice(this.model.map(a => a._id).indexOf(item._id), 1);
        else this.model = {};
      }
      ,
      handleInput() {
        this.$emit('input', this.model);
      }
    }
  }
  ;
</script>
