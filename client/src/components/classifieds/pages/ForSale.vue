<template>
  <q-page class="q-pa-md">

    <top-filter
      v-model="searchInput"
    >
      <template v-slot:bottom>
        <div class="row items-center justify-center">
          <div class="col-12 col-md-6 col-lg-4">
            <div class="row justify-center">
            <boundary-filter
              flat
              flex
              :km="km"
              @km="km = $event"
              color="primary"
              :text-limit="25"
            ></boundary-filter>
            </div>
          </div>
          <div class="col-12 col-md-6 col-lg-4 q-pa-md">
            <div class="row justify-center">
              <div style="width: 100%; max-width: 500px">
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
            </div>

          </div>
          <div class="col-12 col-md-6 col-lg-4 q-pa-md">
            <div class="row justify-center">
              <div style="width: 100%; max-width: 500px">
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
              <q-btn color="nice" v-show="minMaxDirty" class="q-mx-xs" push size="sm" label="go"
                     @click="changeMinMax"></q-btn>
              </div>
              </div>
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
  import TagPicker from 'components/common/atoms/pickers/TagPicker';
  import BoundaryFilter from 'components/common/atoms/filters/BoundaryFilter';

  export default {
    name: 'ForSale',
    components: { BoundaryFilter, TagPicker, TopFilter, ClassifiedsCard, PaginateList, ClassifiedsForm },
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
        useMax: null,
        km: 10
      };
    },
    computed: {
      query() {
        let query = {
          $sort: { createdAt: -1 }
        };
        if (this.lget(this.tagFilter, [0])) {
          query.tags = { $in: this.tagFilter };
        }
        if (this.useMin > 0) {
          query['price.basePrice'] = { $gte: this.useMin };
        }
        if (typeof this.useMax === 'number') {
          query['price.basePrice'] = { $lte: this.useMin };
        }
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
