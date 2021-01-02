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

export const loadPaginatedMixin = {
  mounted() {

  },
  data() {
    return {
      total: 0,
      getterSkip: 0,
      actionSkip: 0,
      getterLimit: 25,
      actionLimit: 25,
      // searchInput: '',
      // queryAdders: {},
      // paramsFromClient: {},
      paginateLoading: false
    };
  },
  computed: {
    skip() {
      return this.getterSkip;
    },
    limit() {
      return this.getterLimit;
    },
    useTagPath(){
      return this.tagPath ? this.tagPath : 'tags';
    },
    computeGetterSkip() {
      let skip = typeof this.getterSkip === 'number' ? this.getterSkip : 0;
      let limit = this.getterLimit && typeof this.getterLimit === 'number' ? this.getterLimit : typeof this.getterLimit === 'number' ? this.getterLimit : 0;
      return skip * limit;
    },
    computeActionSkip() {
      let skip = typeof this.actionSkip === 'number' ? this.actionSkip : 0;
      let limit = this.actionLimit && typeof this.actionLimit === 'number' ? this.actionLimit : typeof this.actionLimit === 'number' ? this.actionLimit : 0;
      return skip * limit;
    },
    filterName() {
      return this.filterByName ? this.filterByName : 'name';
    },
    stateItems() {
      let query = this.queryAdders ? Object.assign({}, this.queryAdders) : {};

      let getterAdders = this.getterAdders ? Object.assign({}, this.getterAdders) : {};

      if (!this.noPaginateGetter) {
        query.$limit = this.getterLimit;
        query.$skip = this.computeGetterSkip;
      }

      let text = this.searchInput;
      if (text && typeof (text) === 'string' && text.length) {
        let nameSearch = {
          $regex: text,
            $options: 'igm'
        };
        if(this.tagSearch){
          console.log('tag search on');
          let nameObj = {};
          nameObj[this.filterName] = nameSearch;
          let tagObj = {};
          let patternExp =  new RegExp('^' + text, 'igm');
          tagObj[this.useTagPath] = { $in: patternExp };
          query.$or = [nameObj, tagObj];
        } else {
          query[this.filterName] = nameSearch;
        }
      }
      let list = this.$store.getters[`${this.loadService}/find`]({
        query: { ...query, ...getterAdders }
      }).data;
      // console.log('returning list', {...query, ...getterAdders}, list);
      if (list) {
        return list;
      } else return [];
    }
  },
  methods: {
    reloadItems(i) {
      if (typeof i === 'number') {
        let nextGetterSkip = this.getterLimit * (this.getterSkip + i);
        if (this.computeActionSkip > this.computeGetterSkip && (i >= this.computeActionSkip) && this.computeActionSkip >= nextGetterSkip) {
          this.getterSkip = i;
        } else {
          this.getterSkip = i;
          this.actionSkip = i;
          this.loadItems();
        }
      }
    },
    async loadItems(text) {
      console.log('loading paginate mixin', this.loadService);
      this.paginateLoading = true;
      let adders = this.queryAdders ? Object.assign({}, this.queryAdders) : {};
      let actionAdders = this.actionAdders ? Object.assign({}, this.actionAdders) : {};
      let query = {
        ...{
          $limit: this.actionLimit,
          $skip: this.computeActionSkip,
        }, ...adders, ...actionAdders
      };
      console.log('text', text);
      if (text && typeof (text) === 'string' && text.length) {
        let nameSearch = {
          $regex: text,
          $options: 'igm'
        };
        if(this.tagSearch){
          let nameObj = {};
          nameObj[this.filterName] = nameSearch;
          let tagObj = {};
          let patternExp =  new RegExp('^' + text, 'igm');
          tagObj[this.useTagPath] = { $in: [ patternExp ] };
          query.$or = [nameObj, tagObj];
        } else {
          query[this.filterName] = nameSearch;
        }
      }
      let params = { query: query };
      if (this.paramsAdders && Object.keys(this.paramsAdders).length) {
        Object.keys(this.paramsAdders).forEach(param => {
          params[param] = this.paramsAdders[param];
        });
      }
      console.log('before load', this.queryAdders, query, text, this.filterName);
      return await this.$store.dispatch(`${this.loadService}/find`, params).then(res => {
        console.log('got res', this.loadService, params, res);
        this.paginateLoading = false;
        this.localLoaded = res.data;
        this.total = res.total;
        return res;
      }).catch(err => {
        console.log(`${this.loadService} load error`, err.message);
        this.paginateLoading = false;
      });
    }
  }
};
