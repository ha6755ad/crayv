//options is needed as a local data or computed property for activeValues to work when emitValue is true

export const SelectMixin = {
  data() {
    return {
      selected: null
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(newVal) {
        this.selected = newVal;
        if (newVal && this.emitValue) {
          setTimeout(() => {
            if (!this.activeItem && this.selectService) {
              if (!this.multiple) {
                this.$store.dispatch(`${this.selectService}/get`, newVal, this.selectParamsAdders);
              } else if(this.activeIds && this.selectService) {
                let params = this.selectParamsAdders;
                params.query = { _id: { $in: this.activeIds } };
                this.$store.dispatch(`${this.selectService}/find`, params);
              }
            }
          }, 300);
        }
      }
    }
  },
  computed: {
    idVal() {
      return this.optionValue ? this.optionValue : '_id';
    },
    selectService() {
      return this.loadService;
    },
    selectParamsAdders() {
      return this.paramsAdders ? this.paramsAdders : {};
    },
    stateActiveItems(){
      if(this.selectService && typeof this.selectService === 'string') {
        if (!this.emitValue) return this.value;
        else if (this.multiple) {
          let query = { _id: { $in: this.activeIds ? this.activeIds : [] } };
          return this.$store.getters[`${this.selectService}/find`]({
            query: query
          }).data;
        } else {
          return this.$store.getters[`${this.selectService}/get`](this.value);
        }
      } else return [];
    },
    localActiveItems(){
      if(this.emitValue) {
        if (this.value) {
          let list = this.options ? this.options : [];
          return !this.idVal ? list.filter(a => this.activeIds.includes(a)) : list.filter(a => this.activeIds.includes(a[this.idVal]));
        } else return this.selected;
      } else return this.selected;
    },
    activeItems() {
      return this.selectService ? this.stateActiveItems : this.localActiveItems;
    },
    activeItem() {
      return this.lget(this.activeItems, [0]);
    },
    activeIds() {
      if (this.value) {
        let list = Array.isArray(this.value) ? this.value : [this.value];
        //you an set idval to null to have not map on a non-emitValue component such as when the value is a string or list of strings
        return !this.idVal || this.emitValue ? list : list.map(a => a[this.idVal]);
      } else return [];
    },
  },
  methods: {
    removeItem(i, val) {
      this.selected.splice(i, 1);
      this.$emit('input', this.selected);
      this.$emit('rmvInput', val, i);
    },
    isSelected(val) {
      let id = this.lget(val, this.idVal) ? val[this.idVal] : val;
      return this.activeIds.includes(id);
    },
    selectedIndex(val) {
      let checkVal = this.idVal ? this.lget(val, this.idVal, val) : val;
      if(this.multiple) {
        console.log('check val', val, this.activeIds);
        return this.activeIds && checkVal ? this.activeIds.map(a => JSON.stringify(a)).indexOf(JSON.stringify(checkVal)) : -1;
      } else if(this.emitValue) {
        return checkVal === this.value ? 0 : -1;
      } else {
        return checkVal === this.lget(this.value, [this.idVal], this.value) ? 0 : -1;
      }
    },
    handleInput(val) {
      let idx = this.selectedIndex(val);
      console.log('input idx', idx, val, this.multiple);
      if (idx === -1) {
        let payload = val;
        if (this.emitValue) {
          payload = val[this.idVal];
        }
        if (this.multiple) {
          this.selected ? this.selected.push(payload) : this.selected = [payload];
          console.log('selected after push', this.selected);
        } else {
          this.selected = payload;
        }
        this.$emit('newInput', val);
      } else {
        console.log('splicing', idx);
        this.multiple ? this.selected.splice(idx, 1) : this.selected = null;
        this.$emit('rmvInput', val, idx);
      }
      console.log('handle input', val, this.selected);
      this.$emit('input', this.selected);
    }
  }
};
