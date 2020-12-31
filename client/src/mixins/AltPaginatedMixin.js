// Service Config:
// Add these properties to your local component:
//
// loadService - String - the service you want to load from
// Optional**
//   filterByName - String - use for key to filter on. Defaults to 'name'
//   searchInput -  String - use to model search input for filtering by key
//   queryAdders - Object - key/value query properties you wish to add to your query
//   paramsAdders - Object - paramsFromClient you wish to add such as $populateParams
//
// Methods to call:
// reloadItems(i) - where i is the page number of records you want to access - increment simply or use a paginator. reloadItems(0) will simply call the first page of records
//
// loadItems(text) - text is optional you can pass it in if you wish to regex search on your filterByName, otherwise it will just load based on your queryAdders and paramsAdders
//
// Usable Returns:
// stateItems - Array - list of returned records
// paginateLoading - Boolean - loading status

// ** any service you need will need '$regex' and '$options' in the service whitelist if you want to use search

export const AltPaginatedMixin = {
  mounted(){

  },
  data() {
    return {
      altTotal: 0,
      altLimit: 25,
      altGetterSkip: 0,
      altActionSkip: 0,
      // searchInput: '',
      // queryAdders: {},
      // paramsFromClient: {},
      altPaginateLoading: false
    };
  },
  computed: {
    altSkip(){
      return this.altActionSkip;
    },
    altComputeGetterSkip() {
      let skip = typeof this.altGetterSkip === 'number' ? this.altGetterSkip : 0;
      let limit = this.altGetterLimit && typeof this.altGetterLimit === 'number' ? this.altGetterLimit : typeof this.altGetterLimit === 'number' ? this.altGetterLimit : 0;
      return skip * limit;
    },
    altComputeActionSkip() {
      let skip = typeof this.altActionSkip === 'number' ? this.altActionSkip : 0;
      let limit = this.altActionLimit && typeof this.altActionLimit === 'number' ? this.altActionLimit : typeof this.altGetterLimit === 'number' ? this.altGetterLimit : 0;
      return skip * limit;
    },
    filterName() {
      return this.altFilterByName ? this.altFilterByName : 'name';
    },
    stateItems() {
      let query = this.altQueryAdders ? Object.assign({}, this.altQueryAdders) : {};

      let getterAdders = this.altGetterAdders ? Object.assign({}, this.altGetterAdders) : {};

      if(!this.noPaginateGetter){
        query.$limit = this.altGetterLimit;
        query.$skip = this.altComputeGetterSkip;
      }

      let text = this.altSearchInput;
      if (text && typeof(text) === 'string' && text.length) {
        query[this.altFilterName] = {
          $regex: text,
          $options: 'igm'
        };
      }
      let list = this.$store.getters[`${this.altLoadService}/find`]({
        query: {...query, ...getterAdders}
      }).data;
      if(list){
        return list;
      } else return [];
    }
  },
  methods: {
    altReloadItems(i) {
      if (typeof i === 'number') {

        this.altSkip = i;
        this.altLoadItems();
      }
    },
    async altLoadItems(text) {
      console.log('loading paginate mixin', this.altLoadService);
      this.altPaginateLoading = true;
      let adders = this.altQueryAdders ? Object.assign({}, this.altQueryAdders) : {};
      let actionAdders = this.altActionAdders ? Object.assign({}, this.altActionAdders) : {};
      let query = {
        ...{
          $limit: this.altActionLimit,
          $skip: this.altComputeActionSkip
        }, ...adders, ...actionAdders
      };
      console.log('text', text);
      if (text && typeof(text) === 'string' && text.length) {
        console.log('found text', text);
        query[this.altFilterName] = {
          $regex: text,
          $options: 'igm'
        };
      }
      let params = { query: query };
      if (this.altParamsAdders && Object.keys(this.altParamsAdders).length) {
        Object.keys(this.altParamsAdders).forEach(param => {
          params[param] = this.altParamsAdders[param];
        });
      }
      console.log('before load', this.altQueryAdders, query, text, this.filterName);
      return await this.$store.dispatch(`${this.altLoadService}/find`, params).then(res => {
        console.log('got res', this.altLoadService, params, res);
        this.altPaginateLoading = false;
        this.altLocalLoaded = res.data;
        this.altTotal = res.total;
        return res;
      }).catch(err => {
        console.log(`${this.altLoadService} load error`, err.message);
        this.altPaginateLoading = false;
      });
    }
  }
};
