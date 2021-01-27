<template>
  <div>
    <q-list>
      <q-item dense>
        <q-item-section>
          <q-item-label class="text-weight-bold text-grey-6">Classifieds Menu</q-item-label>
        </q-item-section>
      </q-item>
      <q-item v-for="(item, i) in items" :key="`classified-drawer-item-${i}`" clickable @click="item.click()">
        <q-item-section avatar>
          <q-btn round flat class="bg-shade-2 text-nice" :icon="item.icon"></q-btn>
        </q-item-section>
        <q-item-section>
          <div>
          <q-item-label class="text-xs text-mb-xs">{{item.label}}</q-item-label>
            <div class="__classified_underline q-mt-xs bg-primary-secondary" :style="item.active ? {} : {width: 0}"></div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
  export default {
    name: 'ClassifiedsDrawer',
    computed: {
      items(){
        return [
          {
            label: 'For Sale',
            icon: 'mdi-sign-real-estate',
            active: this.$route.name === 'classifieds',
            click: () => {
              this.$routerPreserve({name: 'classifieds'});
            }
          },
          {
            label: 'My Listings',
            icon: 'mdi-page-layout-body',
            active: this.$route.name === 'my-listings',
            click: () => {
              this.$routerPreserve({name: 'my-listings'});
            }
          },
          {
            label: 'My Offers',
            icon: 'mdi-gavel',
            active: this.$route.name === 'my-offers',
            click: () => {
              this.$routerPreserve({name: 'my-offers'});
            }
          }
        ];
      }
    }
  };
</script>

<style scoped lang="scss">
  .__classified_underline {
    height: 2px;
    width: 60%;
    transition: all .2s ease-out;
  }
</style>
