<template>
  <q-page class="q-pa-md">
    <div class="text-md text-mb-md text-weight-bold">Peer Exchange</div>
    <div class="row justify-end">
      <q-btn icon="mdi-page-layout-body" label="Post" push color="nice" size="sm" @click="addDialog = true"></q-btn>
    </div>

    <paginate-list
      load-service="crayv-classifieds"
      :query-in="query"
      grid
      search
      v-model="selected"
      row-min-max="380px, 420px"
    >
      <template v-slot:card="scope">
        <classifieds-card :value="scope.item"></classifieds-card>
      </template>
      <template v-slot:form="{close}">
        <classifieds-form @input="close"></classifieds-form>
      </template>
    </paginate-list>

  </q-page>
</template>

<script>
  import ClassifiedsForm from 'components/classifieds/forms/ClassifiedsForm';
  import PaginateList from 'components/common/substance/lists/PaginateList';
  import ClassifiedsCard from 'components/classifieds/cards/ClassifiedsCard';
  export default {
    name: 'CrayvClassifieds',
    components: { ClassifiedsCard, PaginateList, ClassifiedsForm },
    data(){
      return {
        addDialog: false,
        selected: null
      };
    },
    computed: {
      query(){
        let query = {};
        return query;
      }
    }
  };
</script>

<style scoped>

</style>
