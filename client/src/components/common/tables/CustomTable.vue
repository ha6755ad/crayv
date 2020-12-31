<template>
  <div style="height: 100%; width: 100%" class="q-pb-md">
    <q-card :dark="$attrs.dark" style="height: 100%" class="q-pb-sm">
      <template v-if="!isMobile">
      <StandardTable
        :noAdd="$attrs.noAdd"
        v-bind="standardProps"
        @clickedItem="handleClick"
        @addClick="$emit('addClick')"
        @actionClick="actionClick"
        @popupInput="popupInput"
        @clickIndex="clickIndex"
        :persistentHint="persistentHint"
        @showClosed="$emit('showClosed')"
        :switchOn="switchOn"
      ></StandardTable>
      </template>
      <template v-else>
        <MobileTable
          v-bind="standardProps"
          @clickedItem="handleClick"
          @addClick="$emit('addClick')"
          @actionClick="actionClick"
          @popupInput="popupInput"
          @clickIndex="clickIndex"
        ></MobileTable>
      </template>
          <q-dialog transition-hide="slide-right" transition-show="slide-left" :maximized="$q.screen.lt.md" position="right" :value="dialog" @input="val => !val ? $emit('dialogClose') : ''">
            <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="$emit('dialogClose')"/>
            <slot name="addDialog"></slot>
          </q-dialog>
    </q-card>
  </div>
</template>

<script>

  import StandardTable from './StandardTable';
  import MobileTable from './MobileTable';

  export default {
    name: 'CustomTable',
    components: {MobileTable, StandardTable},
    props: {
      dialog: Boolean,
      actions: Array,
      items: Array,
      dark: Boolean,
      tableTitle: String,
      headers: Array,
      headerColor: String,
      persistentHint: String,
      switchOn: Boolean,
      addBtn: {
        type: Boolean,
        default: true,
      },
      rowSize: {
        type: Number,
        default: 50
      },
      noHeader: Boolean
    },
    data() {
      return {
      };
    },
    computed: {
      isMobile(){
        return this.$q.screen.lt.md;
      },
      standardProps(){
        return {
          actions: this.actions,
          items: this.items,
          dark: this.dark,
          tableTitle: this.tableTitle,
          headers: this.headers,
          headerColor: this.headerColor,
          rowSize: this.rowSize,
          noHeader: this.noHeader
        };
      }
    },
    methods: {
      clickIndex(i){
        this.$emit('clickIndex', i);
      },
      actionClick(index, item){
        this.$emit(this.actions[index].emit, item, index);
      },
      popupInput(item, header, val) {
        this.$emit('popupInput', item, header, val);
      },
      handleClick(item, header) {
        this.$emit('clickedItem', item, header);
      },
    }
  };
</script>


