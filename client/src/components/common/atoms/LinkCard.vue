<template>
  <div :class="classIn ? classIn : 'q-pa-sm'" :style="styleIn">
    <div v-if="title" :class="`text-${textColor ? textColor : 'primary'} text-sm text-mb-md text-weight-medium`">{{ title }}</div>
    <div v-if="subTitle" class="text-xxs text-mb-xs text-weight-light" :style="{color: subTitleColor}">{{subTitle}}</div>

    <div class="__link_grid" @click.stop="copyLink">
      <q-btn class="q-mr-sm" :color="iconColor" flat round icon="mdi-content-copy"/>
      <input :style="{border: 'none', width: '100%', color: subTitleColor, background: 'transparent', fontWeight: 600}" :value="url" :id="id">
    </div>

    <div v-if="underTitle" :class="`row justify-end text-${textColor ? textColor : 'primary'} text-xs text-mb-xs text-weight-medium`" style="transform: translate(0, -50%)">
      <div>{{ underTitle }}</div>
    </div>

  </div>
</template>

<script>
  export default {
    name: 'LinkCard',
    props: {
      classIn: String,
      styleIn: String,
      underTitle: String,
      textColor: {
        type: String,
        default: 'primary'
      },
      subTitleColor: {
        type: String,
        default: 'dark-blue'
      },
      iconColor: {
        type: String,
        default: 'primary'
      },
      url: String,
      title: String,
      subTitle: String,
      id: {
        type: String,
        default: 'link_text'
      }
    },
    methods: {
      copyLink() {
        let text = document.getElementById(this.id);
        text.select();
        text.setSelectionRange(0, 99999);
        document.execCommand('copy');
        this.$q.notify({
          message: 'Link Copied to Clipboard',
          color: 'info',
          icon: 'mdi-content-copy'
        });
      },
    }
  };
</script>

<style>
  .__link_grid {
    display: grid;
    width: 100%;
    height: 40px;
    grid-template-rows: 100%;
    grid-template-columns: auto 1fr;
  }
</style>
