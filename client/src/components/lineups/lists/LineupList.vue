<template>
  <div style="width: 100%">
    <div class="q-pa-md" v-if="title || subtitle">
      <div :class="titleClass">
        {{title}}
      </div>
      <div :class="subtitleClass">
        {{subtitle}}
      </div>
    </div>
    <load-and-paginate
      :query-adders="queryAdders"
      :params-adders="paramsAdders"
      :paginator="true"
      :load-service="loadService"
      :load-watch="loadWatch"
      :load-on-mount="!loadWatch"
      :search="search"
      search-placeholder="Search Product Lineups..."
      :search-input-in="searchInput"
    >
      <template v-slot:list="scope">
        <div v-if="!select && editing" class="row justify-end">
          <q-btn push size="sm" color="secondary" label="Add New" icon="mdi-plus" @click="addDialog = true"></q-btn>
        </div>
        <div v-if="!select" :class="`row ${noWrap ? 'no-wrap' : ''}`" :style="noWrap ? { overflowX: 'scroll'} : {}">
          <div :class="`col-${cols} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl} q-pa-sm`" v-for="(lineup, i) in scope.items" :key="`pg-${i}`">
            <q-card style="height: 380px; width: 100%; border-radius: 10px">
              <lineup-card :editing="editing" :value="lineup"></lineup-card>
            </q-card>
          </div>
        </div>
        <q-select
          label="Search Product Lineups..."
          v-if="select"
          :options="scope.items"
          behavior="menu"
          :multiple="multiple"
          :value="activeItems"
          use-input
          @input-value="searchInput = $event"
        >
          <template v-slot:no-option>
            <add-list-item v-if="editing" @add="addDialog = true"></add-list-item>
          </template>
          <template v-slot:before-options>
            <add-list-item v-if="editing" @add="addDialog = true"></add-list-item>
          </template>
          <template v-slot:selected-item="{ opt, index }">
            <q-chip dark removable @remove="removeItem(index, opt)">
              <default-avatar :value="opt" avatar-path="images"></default-avatar>
              {{lget(opt, 'name')}}
            </q-chip>
          </template>
<!--          <template v-slot:option="{ opt, index }">-->
<!--            <lineup-it :value="opt" @add="handleInput" :editing="editing">-->
<!--              &lt;!&ndash;          TODO: this slot not working&ndash;&gt;-->
<!--              <template v-if="$scopedSlots.side" v-slot:side>-->
<!--                <slot name="side" :item="opt" :index="index"></slot>-->
<!--              </template>-->
<!--            </lineup-it>-->
<!--          </template>-->
        </q-select>
      </template>
    </load-and-paginate>

    <q-dialog position="left" :maximized="$q.screen.lt.sm" transition-hide="slide-left" transition-show="slide-right" v-model="addDialog">
      <q-card style="width: 600px; max-width: 100vw; height: 100vh">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="addDialog = false"/>
        <lineup-form></lineup-form>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
  import LoadAndPaginate from 'components/common/atoms/loading/LoadAndPaginate';
  import {SelectMixin} from 'src/mixins/SelectMixin';
  import {mapGetters} from 'vuex';
  import LineupForm from 'components/lineups/forms/LineupForm';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import AddListItem from 'components/common/atoms/search/AddListItem';
  import LineupCard from 'components/lineups/cards/LineupCard';

  export default {
    mixins: [SelectMixin],
    components: { LineupCard, AddListItem, DefaultAvatar, LineupForm, LoadAndPaginate },
    props: {
      select: Boolean,
      noWrap: Boolean,
      cols: { type: Number, default: 12 },
      sm: { type: Number, default: 6 },
      md: { type: Number, default: 4 },
      lg: { type: Number, default: 3 },
      xl: { type: Number, default: 2 },
      title: String,
      subtitle: String,
      titleClass: {
        type: String,
        default: 'text-sm text-mb-md text-weight-medium'
      },
      subtitleClass:  {
        type: String,
        default: 'text-xs text-mb-sm text-weight-light'
      },
      flat: {
        type: Boolean,
        default: true
      },
      loadWatch: {
        required: false
      },
      emitValue: Boolean,
      multiple: Boolean,
      editing: Boolean,
      search: Boolean,
      showInactive: {
        type: Boolean,
        default: false
      },
      queryIn: Object,
      paramsIn: Object,
      value: { required: false }
    },
    data(){
      return {
        searchInput: '',
        addDialog: false
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      loadService(){
        return 'crayv-product-lineups';
      },
      queryAdders(){
        let activeObj = { active: !this.showInactive };
        return this.queryIn ? {...this.queryIn, ...activeObj} : activeObj;
      },
      paramsAdders(){
        return this.paramsIn;
      }
    },
    methods: {

    }
  };
</script>
