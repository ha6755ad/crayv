<template>
  <q-page class="q-pa-md">

    <top-filter
      v-model="searchInput"
    >
      <template v-slot:bottom>
        <div class="row items-center">
          <div class="col-12 col-sm-6 col-md-4 q-py-sm">
            <boundary-filter-button
              :text-limit="50"
              :btn-props="{color: 'primary', flat: true, size: $q.screen.lt.md ? 'sm' : ''}"></boundary-filter-button>
          </div>
          <div class="col-12 col-sm-6 col-md-4 q-py-sm">


              <tag-picker
                outlined
                dense
                service-in="crayv-classifieds"
                placeholder="Categories..."
                empty-text="No categories found..."
                multiple
                v-model="tagFilter"
              ></tag-picker>

          </div>
          <div class="col-12 col-sm-6 col-md-4 q-py-sm">
            <div class="row justify-around">

              <div style="position: relative; width: 200px; max-width: 40%" class="q-mx-sm">
                <div class="text-xxxs text-mb-xxxs text-weight-light __price_limit">Min Price</div>
                <q-input @keyup.enter="changeMinMax" @input="minMaxDirty = true" filled dense hide-bottom-space
                         :clearable="min > 0" @clear="min = 0" v-model.number="min"
                         input-class="text-xs text-mb-xs text-weight-bold"></q-input>
              </div>
              <div style="position: relative; width: 200px; max-width: 40%" class="q-mx-sm">
                <div class="text-xxxs text-mb-xxxs text-weight-light __price_limit">Max Price</div>
                <q-input @keyup.enter="changeMinMax" @input="minMaxDirty = true" filled dense hide-bottom-space
                         clearable
                         @clear="max = null" v-model.number="max"
                         input-class="text-xs text-mb-xs text-weight-bold"></q-input>
              </div>
              <q-btn color="nice" v-show="minMaxDirty" class="q-mx-xs" round push size="sm" label="go"
                     @click="changeMinMax"></q-btn>
            </div>
          </div>
        </div>
      </template>
    </top-filter>

    <paginate-list
      title="Peer to peer Exchange"
      load-service="crayv-classifieds"
      :query-in="query"
      grid
      :search-input-in="searchInput"
      v-model="selected"
      row-min-max="380px, 420px"
      adding
      add-label="New Listing"
    >
      <template v-slot:card="scope">
        <classifieds-card :value="scope.item"></classifieds-card>
      </template>
      <template v-slot:form="{close}">
        <classifieds-form @input="close"></classifieds-form>
      </template>
    </paginate-list>

  </q-page>
</template>

<script>
  import ClassifiedsForm from 'components/classifieds/forms/ClassifiedsForm';
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import ClassifiedsCard from 'components/classifieds/cards/ClassifiedsCard';
  import TopFilter from 'components/common/atoms/filters/TopFilter';
  import BoundaryFilterButton from 'components/common/atoms/filters/BoundaryFilterButton';
  import TagPicker from 'components/common/atoms/pickers/TagPicker';

  export default {
    name: 'ForSale',
    components: { TagPicker, BoundaryFilterButton, TopFilter, ClassifiedsCard, PaginateList, ClassifiedsForm },
    data() {
      return {
        addDialog: false,
        selected: null,
        searchInput: '',
        tagFilter: [],
        minMaxDirty: false,
        min: 0,
        max: null,
        useMin: 0,
        useMax: null
      };
    },
    computed: {
      query() {
        let query = {};
        return query;
      }
    },
    methods: {
      changeMinMax() {
        this.useMin = this.min;
        this.useMax = this.max;
        this.minMaxDirty = false;
      }
    }
  };
</script>

<style scoped lang="scss">
  .__price_limit {
    position: absolute;
    top: 0;
    left: 5%;
    transform: translate(0, -50%);
  }
</style>
