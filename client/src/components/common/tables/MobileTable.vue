<template>
    <div class="body_container">
      <div class="table_body" :style="bodyStyle">
        <!--        <div></div>-->
        <div class="table_row" :style="tableRowStyle(idx)" v-for="(item, idx) in items" :key="idx">
          <div v-for="(header, i) in headerStruct" :key="i" class="body_cell" @click="clickIndex(i)" :style="clicked === i ? {height: '100px'} : {}">
            <!--              in cell popup-->
            <div class="cell_popup" v-if="popup === idx && clicked === i && header.canEdit" style="z-index: 1000">
              <component :is="header.popup" @input="popupInput(item, header, ...arguments)"
                         v-bind="header.popupProps" :value="item[header.value]"></component>
            </div>
            <!--                prepend checkbox-->
            <span v-if="header.prepend"><v-icon>x</v-icon></span>
            <!--              action icons-->
            <div class="action_cell" v-else-if="header.actionHeader">
              <q-btn round flat size="xs" v-for="(action, index) in actions" :key="index" @click="$emit('actionClick', index, item)"
                     class="q-mr-xs" :icon="action.icon">
              </q-btn>
            </div>
            <!--              standard content-->
            <div v-else :style="header.clickable ? {cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between'} : {display: 'flex', alignItems: 'center', justifyContent: 'space-between'}"
                 @click="header.clickable ? handleClick(idx, item, header) : ''">
              <div>{{header.text + ': '}}</div>
              <div>{{lget(item, header)}}</div>
            </div>
          </div>
        </div>
        <!--        <div class="body_col" :style="{'grid-template-rows': rowStyle}">-->
        <!--        </div>-->
      </div>
    </div>
</template>

<script>
// import GroupSearch from '../../utils/search_box';

  export default {
    name: 'MobileTable',
    components: {
    // GroupSearch
    },
    props: {
      actions: Array,
      dark: Boolean,
      items: Array,
      tableTitle: String,
      headers: Array,
      headerColor: String,
      rowSize: {
        type: String,
        default: '50px',
      },
      noHeader: Boolean
    },
    data() {
      return {
        // for row in header
        popup: -1,
        // for header in cols
        clicked: -1,
        searchMethod: 0,
        search: ''
      };
    },
    computed: {
      headerStruct() {
        let h = this.headers.slice();
        h.unshift({prepend: true});
        h.push({actionHeader: true});
        return h;
      },
      rowStyle() {
        return 'repeat(' + this.items.length + ', auto)';
      },
      bodyStyle() {
        return {
          'grid-template-columns': '100fr',
          'grid-template-rows': this.rowStyle
        };
      },
      keyView(){
        return this.headers.map(a => a.value).concat(this.headers.map(b => b.nested_value)).filter(n => typeof n !== 'undefined');
      },
      itemsProp(){
        return this.items;
      },
    // itemsList() {
    //   let item_list = [];
    //   let keys = ['type', 'homeowner', 'name', 'status', 'employee', 'rep', 'dealer', 'address'];
    //   switch (this.searchMethod) {
    //     case 0:
    //       item_list = this.searchAndMatch(this.itemsProp, this.search, keys);
    //       break;
    //     case 1:
    //       item_list = this.searchOrMatch(this.itemsProp, this.search, keys);
    //       break;
    //     case 2:
    //       item_list = this.searchExactMatch(this.itemsProp, this.search, keys);
    //       break;
    //   }
    //   return item_list.sort((a, b) => this.sortByDate(b, a))
    // },
    },
    methods: {
      // itemValue(item, header){
      //   console.log('getting item value', item, header, typeof header.value)
      //   if(typeof header.value === 'function'){
      //     return header.value(item)
      //   } else return item[header.value]
      // }
      tableRowStyle(i) {
        if(i === this.popup) {
          return {
            'z-index': 1000,
            'grid-template-columns': '1fr',
            'grid-template-rows': 'repeat(' + this.headerStruct.length + ', auto)'
          };
        } else return {
          'z-index': 'inherit',
          'grid-template-columns': '1fr',
          'grid-template-rows': 'repeat(' + this.headerStruct.length + ', auto)'
        };
      },
      popupInput(item, header, val) {
        // console.log('input in standard', item, header, val)
        this.$emit('popupInput', item, header, val);
      },
      clickIndex(i) {
        // console.log('clicked', i)
        this.clicked = i;
        this.$emit('clickIndex', i);
      },
      lget(item, header) {
        // console.log('getting value', item, header)
        if (item[header.value] && typeof item[header.value] !== 'undefined') {
          if (Array.isArray(item[header.value])) {
            // console.log('got array', item[header.value], header)
            if(item[header.value] && typeof item[header.value] !=='undefined' && item[header.value].length > 1){
              let len = item[header.value].length - 1;
              // console.log('array', header.nested_value ? item[header.value][0][header.nested_value] : item[header.value][0])
              return header.nested_value && item[header.value][0][header.nested_value] ? item[header.value][0][header.nested_value] + ' +' + len + ' more' : header.nested_value ? 'n/a' : item[header.value][0] + ' +' + len + ' more' || 'none';
            } else return header.nested_value && item[header.value].length && item[header.value][0][header.nested_value] ? item[header.value][0][header.nested_value] : header.nested_value ? 'n/a' : item[header.value][0] || 'none';
          } else return header.nested_value && item[header.value][header.nested_value] ? item[header.value][header.nested_value] : header.nested_value ? 'n/a' : item[header.value] || 'none';
        } else if (header.value) {
          return 'n/a';
        } else return '';
      },
      handleClick(idx, item, header) {
        this.popup = idx;
        this.$emit('clickedItem', item, header);
      },
      addClick() {
        this.$emit('addClick');
      }
    }
  };
</script>

<style scoped lang="scss">
  .body_container {
    height: 100%;
    width: 100%;
    position: relative;
    overflow-y: scroll;
    display: grid;
  }

  .table_body {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    display: grid;
  }

  .table_row {
    height: 100%;
    width: 100%;
    display: grid;
  }

  .header_box {
    height: 100%;
    width: 100%;
    display: grid;
    align-items: center;
    font-size: 14px;
    color: #757575;
    border-bottom: solid 1px #9e9e9e;
  }

  .body_col {
    width: 100%;
    display: grid;
  }

  .body_cell {
    height: 100%;
    width: 100%;
    display: grid;
    align-items: center;
    padding: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    border-bottom: solid 1px #eeeeee;
    position: relative;
  }

  .cell_popup {
    position: absolute;
    top: -30%;
    left: 0%;
  }

  .action_cell {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .add_btn {
    position: absolute;
    top: 10px;
    right: 5%;
  }
</style>
