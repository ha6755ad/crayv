<template>
  <q-page class="flex justify-center bg-light" :style="$q.screen.lt.md ? {} : { padding: '0 5%' }">
    <div class="t-l">
      <default-avatar square :value="marketplace" size-in="90px"></default-avatar>
    </div>
    <q-card flat :style="{width: $q.screen.lt.md ? '100%' : '90%', height: '100vh', position: 'absolute', top: 0, left: $q.screen.lt.md ? 0 : '5%'}">
      <multi-image-viewer btn-position="top" avatar-path="images" :value="marketplace"></multi-image-viewer>
    </q-card>
  </q-page>
</template>

<script>
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import {mapGetters} from 'vuex';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';

  export default {
    name: 'Marketplace',
    components: { DefaultAvatar, MultiImageViewer },
    data(){
      return {
        id: null
      };
    },
    watch: {

    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      ...mapGetters('crayv-marketplaces', { getMarketplace: 'get' }),
      marketplaceName() {
        return this.$route.params.marketplace;
      },
      marketplaceId() {
        return this.lget(this.$route, 'query.marketplaceId', this.lget(this.id));
      },
      marketplace() {
        return this.marketplaceId ? this.getMarketplace(this.marketplaceId) : null;
      }
    }
  };
</script>

<style scoped>

</style>
