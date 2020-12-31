<template>
  <div class="table_box">
      <div class="table_header text-sm text-mb-sm text-weight-light" v-if="!noHeader" :style="headerStyle">
        <div :style="{'margin-left': '2%', color: dark ? 'white' : '#212121'}">{{tableTitle}}</div>
        <!--        <div style="width: 70%; margin: 0 0 10px 5%">-->
        <!--         -->
        <!--        </div>-->
        <template v-if="switchOn">
        <div class="flex-grow-1"></div>
        <q-toggle dark :style="{'margin-right': '10%','margin-top': '0px'}" @input="$emit('showClosed')" :value="true" color="white"></q-toggle>
        </template>
        <q-btn class="add_btn bg-light text-dark" round @click="addClick" icon="mdi-plus" v-if="!$attrs.noAdd">
        </q-btn>
      </div>
    <table style="width: 100%">
    <thead class="table_top" :style="topStyle">
      <tr class="header_row">
        <!--        <div></div>-->
        <th v-for="(header, i) in headerStruct" :key="i" class="header_box">
              <span>{{header.text ? header.text : ''}}&nbsp;<q-icon size="20px"
                                                                    v-if="header.text" name="mdi-arrow-up-down-bold"/></span>
        </th>
        <!--        <div></div>-->
      </tr>
    </thead>
    <tbody class="body_container">
        <!--        <div></div>-->
        <tr class="table_row" :style="tableRowStyle(idx)" v-for="(item, idx) in items" :key="idx">
          <td v-for="(header, i) in headerStruct" :key="i" class="body_cell" @click="clickIndex(i)" :style="{borderLeft: i > 0 ? '' : 'none'}">
            <!--              in cell popup-->
<!--            <q-popup-edit @input="popupInput(item, header, ...arguments)" :value="header.popupProps.value">-->
<!--              <component :is="header.popup" @input="emitValue" v-bind="header.popupProps"></component>-->
<!--            </q-popup-edit>-->
            <div class="cell_popup" v-if="popup === idx && clicked === i && header.canEdit" style="z-index: 1000">
              <component :is="header.popup" @input="popupInput(item, header, ...arguments)"
                         v-bind="header.popupProps" :value="item[header.value]"></component>
            </div>
            <!--                prepend checkbox-->
            <div v-if="header.prepend" style="width: 100%" class="text-center"><q-icon name="mdi-checkbox-blank-outline"></q-icon></div>
            <!--              action icons-->
            <div class="action_cell" v-else-if="header.actionHeader">
              <q-btn round flat size="xs" v-for="(action, index) in actions" :key="index" @click="$emit('actionClick', index, item)"
                     class="q-mr-xs">
                <q-icon :name="action.icon"></q-icon>
              </q-btn>
            </div>
            <!--              standard content-->
            <div class="standard_cell" v-else :style="header.clickable ? {cursor: 'pointer'} : ''"
                 @click="header.clickable ? handleClick(idx, item, header) : ''">
              {{lget(item, header)}}
            </div>
          </td>
        </tr>
        <!--        <div class="body_col" :style="{'grid-template-rows': rowStyle}">-->
        <!--        </div>-->
    </tbody>
  </table>
  </div>
</template>

<script>
// import GroupSearch from '../../utils/search_box';



  export default {
    name: 'StandardTable',
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
      persistentHint: String,
      switchOn: Boolean,
      rowSize: {
        type: Number,
        default: 50,
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
      colSize() {
        let num = this.headerStruct.length - 2;
        return ((85 / num).toFixed(3)).toString() + '%';
      },
      headerStyle() {
        return {
          'background': this.headerColor,
          'borderRadius': '5px 5px 0 0'
        };
      },
      topStyle() {
        return {
          'height': this.noHeader ? '60px' : '60px 45px',
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
            'height': this.rowSize * 2 + 'px'
          };
        } else return {
          'height': this.rowSize + 'px',
          'z-index': 'inherit',
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
              let val = header.nested_value && item[header.value][0][header.nested_value] ? item[header.value][0][header.nested_value] + ' +' + len + ' more' : header.nested_value ? 'n/a' : item[header.value][0] + ' +' + len + ' more' || 'none';
              if(header.valueFormat){
                return header.valueFormat(val);
              } else return val;
            } else {
              let valA = header.nested_value && item[header.value].length && item[header.value][0][header.nested_value] ? item[header.value][0][header.nested_value] : header.nested_value ? 'n/a' : item[header.value][0] || 'none';
              if (header.valueFormat) {
                return header.valueFormat(valA);
              } else return valA;
            }
          } else {
            let valB = header.nested_value && item[header.value][header.nested_value] ? item[header.value][header.nested_value] : header.nested_value ? 'n/a' : item[header.value] || 'none';
            if(header.valueFormat){
              return header.valueFormat(valB);
            } else return valB;
          }
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
  .table_box {
    height: 100%;
    position: relative;
    width: 100%;
    text-align: right
  }

  .table_top {

  }

  .table_header {
    display: flex;
    align-items: center;
    height: 50px;
  }

  .header_row {

  }

  .body_container {
   position: relative;
  }

  .table_body {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    display: grid;
  }

  .table_row {
    border-bottom: .2px solid rgba(0,0,0,.3);
  }

  .header_box {
    border-bottom: solid 1px #9e9e9e;
  }

  .body_col {

  }

  .body_cell {
    position: relative;
    border-left: .3px solid rgba(0,0,0,.3);
    padding: 2px 2px;

    .standard_cell {
      padding: 0 2%;
    }
  }

  .cell_popup {
    position: absolute;
    top: 0;
    left: 0;
  }

  .action_cell {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
  }

  .add_btn {
    position: absolute;
    top: 0px;
    right: 5%;
  }
</style>
