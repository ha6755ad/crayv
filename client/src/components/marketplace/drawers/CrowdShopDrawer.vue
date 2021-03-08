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
    <div :style="{ height: filters ? 'auto' : 0, transition: 'all .3s ease-out' }">

    </div>
  </div>
</template>

<script>

  export default {
    name: 'CrowdShopDrawer',
    components: { },
    data(){
      return {
        filters: true,
      };
    },
    computed: {
      items(){
        return [
          {
            label: 'Crowd Store',
            icon: 'mdi-sign-real-estate',
            active: this.$route.name === 'crowd-store',
            click: () => {
              this.$routerPreserve({name: 'crowd-store'});
            }
          },
          {
            label: 'My Buys',
            icon: 'mdi-page-layout-body',
            active: this.$route.name === 'my-crowd-buys',
            click: () => {
              this.$routerPreserve({name: 'my-crowd-buys'});
            }
          },
          {
            label: 'My Offers',
            icon: 'mdi-gavel',
            active: this.$route.name === 'my-crowd-offers',
            click: () => {
              this.$routerPreserve({name: 'my-crowd-offers'});
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
