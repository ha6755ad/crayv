<template>
  <q-dialog v-model="dioVideo">
    <q-card style="width: 100%" class="card rounded-borders">
      <q-item-section class="toolBar bg-primary text-white">
        <q-item-label class="text-h6 q-ma-sm">Video</q-item-label>
      </q-item-section>
      <q-card-section>
        <div class="row q-col-gutter-lg">
          <div class="textSize col-12">
            <q-input
              label="Video URL"
              outlined
              v-model="editedItem.url"
            ></q-input>
          </div>
          <div class="createButtonDiv col-12">
            <q-btn class="createButton top_bar bg-secondary text-white" @click="emitURL(editedItem)">Save
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
  const defaultEditedItem = () => {
    return {
      url: '',
    };
  };

  export default {
    name: 'ImportVideo',
    props: {
      dioVideo: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        editedItem: defaultEditedItem(),
        defaultItem: {
          url: '',
        },
      };
    },
    methods: {
      emitURL(editedItem) {
        this.$emit('saveURL', editedItem);
        this.$emit('update:dioVideo', !this.dioVideo);
        this.editedItem = defaultEditedItem();
      },
    },
  };
</script>

<style scoped>
  .createButton {
    width: 200px;
    font-size: 16px;
  }

  .createButtonDiv {
    text-align: center;
    margin-top: 1rem;
  }
</style>
