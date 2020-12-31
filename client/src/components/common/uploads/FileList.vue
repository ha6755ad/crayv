<template>
  <q-card flat>
    <div v-if="cardTitle || cardSubtitle" class="q-pa-sm text-xs text-mb-sm text-weight-medium">
      <div>{{cardTitle}}</div>
      <div class="text-xxs text-mb-xs text-weight-light">{{cardSubtitle}}</div>
    </div>
    <q-list separator>
      <q-item dense v-if="title || addBtn">
        <q-item-section>
          <q-item-label>{{title}}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="addBtn">
          <q-item-section>
            <q-btn size="sm" round :color="color" icon="mdi-plus" @click="$emit('add')">
              <q-popup-proxy>
                <div style="width: 100%">
                  <drag-upload @input="handleInput" :value="value"></drag-upload>
                </div>
              </q-popup-proxy>
            </q-btn>
          </q-item-section>
        </q-item-section>
      </q-item>
      <q-item v-for="(file, i) in value" :key="`file-${i}`" clickable @click="$emit('input', file)">
        <q-item-section avatar>
          <file-preview height="50px" width="40px" :file="file"></file-preview>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{file.name}}</q-item-label>
          <q-item-label caption>{{lget(file, 'info.size')}} kb</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn @click="$emit('remove', file, i)" v-if="removable" color="negative" size="sm" icon="mdi-delete">
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </q-card>
</template>

<script>
  import FilePreview from './FilePreview';
  import DragUpload from './DragUpload';
  export default {
    name: 'FileList',
    components: { DragUpload, FilePreview },
    props: {
      cardTitle: String,
      cardSubtitle: String,
      addBtn: Boolean,
      color: {
        type: String,
        default: 'dark'
      },
      title: String,
      value: Array,
      removable: Boolean
    },
    methods: {
      handleInput(val){
        this.$emit('input', val);
      }
    }
  };
</script>
