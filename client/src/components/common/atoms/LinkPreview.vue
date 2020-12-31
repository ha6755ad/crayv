<template>
  <q-card>
    <link-prevue :url="url">
      <template slot-scope="props">
        <q-card flat class="q-pa-md">
          <div class="row justify-center">
          <q-img :src="props.img" :alt="props.title" style="width: 250px;"></q-img>
          </div>
          <div class="flex flex-center">
            <div class="text-center">
            <div class="text-md text-mb-md text-weight-medium">{{props.title}}</div>
            <div class="text-xs text-mb-xs text-left text-weight-light">{{props.description}}</div>
              <div class="q-my-md">
              <a v-bind:href="props.url" style="text-decoration: none">
                <q-btn label="view" icon="mdi-open-in-new" color="accent"/>
              </a>
              </div>
            </div>
          </div>
        </q-card>
      </template>
    </link-prevue>
  </q-card>
</template>
<script>
// import LinkPrevue from 'link-prevue';

  export default {
    components: {  },
    props: {
      url: String
    }
  };
</script>
