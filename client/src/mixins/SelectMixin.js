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
              if (!this.activeItem) {
                if(!this.multiple) {
                  this.$store.dispatch(`${this.selectService}/get`, newVal, this.selectParamsAdders);
                } else {
                  let params = this.selectParamsAdders;
                  params.query = { _id: { $in: this.activeIds }};
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
      selectParamsAdders(){
        return this.paramsAdders ? this.paramsAdders : {};
      },
      activeItems() {
        if(!this.emitValue) return this.value;
        else if(this.multiple){
          return this.$store.getters[`${this.selectService}/find`]({ query: { _id: { $in: this.activeIds }}}).data;
        } else {
          return this.$store.getters[`${this.selectService}/get`](this.value);
        }
      },
      activeItem(){
        return this.multiple ? this.lget(this.activeItems, [0]) : this.activeItems;
      },
      activeIds() {
        if (this.value) {
          let list = Array.isArray(this.value) ? this.value : [this.value];
          return this.emitValue ? list : list.map(a => a[this.idVal]);
        } else return [];
      }
    },
    methods: {
      removeItem(i) {
        this.selected.splice(i, 1);
        this.$emit('input', this.selected);
      },
      isSelected(val) {
        let id = this.emitValue ? val : val[this.idVal];
        return this.activeIds.includes(id);
      },
      selectedIndex(val) {
        return this.activeIds.map(a => JSON.stringify(a)).indexOf(JSON.stringify(val[this.idVal]));
      },
      handleInput(val) {
        let idx = this.selectedIndex(val);
        console.log('input', idx);
        if (idx === -1) {
          let payload = val;
          if (this.emitValue) {
            payload = val[this.idVal];
          }
          if (this.multiple) {
            this.selected ? this.selected.push(payload) : this.selected = [payload];
          } else this.selected = payload;
        } else {
          console.log('splicing', idx);
          this.multiple ? this.selected.splice(idx, 1) : this.selected = null;
        }
        this.$emit('input', this.selected);
      }
    }
  };
