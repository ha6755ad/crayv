<template>
  <q-page class="q-pa-md">
    <div class="row q-py-lg">
      <tab-stepper
        color="nice"
        :tabs="steps"
        v-model="tab"
        :no-label="$q.screen.lt.sm"
      ></tab-stepper>
    </div>
    <div class="row q-py-lg">
      <btn-picker
        v-model="vendorFilter"
        :options="vendors"
        emit-value
        empty-label="Vendor..."
        before-text="Vendor Filter"
        color="primary"
        :size-in="$q.screen.lt.md ? 'sm' : ''"
        multiple
        clearable
      ></btn-picker>
    </div>
    <div class="row q-py-lg">
      <image-form
        multiple
        v-model="form.images"
        @input="handleInput"
        ></image-form>
    </div>
    <div class="row q-py-lg">
      <multi-image-viewer :value="form" avatar-path="images"></multi-image-viewer>
    </div>
    <div class="row q-py-lg">
      <div class="col-3">
        <default-avatar :value="user"></default-avatar>
      </div>
      <div class="col-3">
        <default-avatar square :value="user"></default-avatar>
      </div>
      <div class="col-3">
        <default-avatar size-in="100px" bordered bg-in="accent" :value="user"></default-avatar>
      </div>
      <div class="col-3">
        <default-avatar :value="user">
          <template v-slot:menu>
            <q-menu>
              <user-contact  size-in="150px" :value="user"></user-contact>
            </q-menu>
          </template>
        </default-avatar>
      </div>
    </div>
  </q-page>
</template>

<script>
  import TabStepper from 'components/common/atoms/tabs/TabStepper';
  import BtnPicker from 'components/common/atoms/pickers/BtnPicker';
  import {makeFindPaginateMixin} from '@ionrev/iy-common-client-lib';
  import ImageForm from 'components/family-pod/personal/ImageForm';
  import MultiImageViewer from 'components/common/atoms/images/MultiImageViewer';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import UserContact from 'components/common/atoms/users/UserContact';
  export default {
    name: 'dumbs',
    components: { UserContact, DefaultAvatar, MultiImageViewer, ImageForm, BtnPicker, TabStepper },
    mixins: [makeFindPaginateMixin({
      name: 'vendors',
      qid: 'vendors',
      service: 'crayv-vendors',
      query() {
        return {};
      },
      makeFindMixinOptions() {
        return {};
      }
    })],
    data(){
      return {
        form: {
          images: []
        },
        tab: 0,
        vendorFilter: null,
      };
    },
    computed: {
      steps(){
        return [
          {
            label: 'Need',
            description: 'Define what resource you\'re looking for',
            icon: 'mdi-numeric-1-circle',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/app_widgets/help_icon.svg',
            notify: 'Choose a resource',
            disable: () => {
              return !(this.form.need && typeof this.form.need !== 'undefined');
            }
          },
          {
            label: 'Amounts',
            description: 'Specify need schedule and amounts',
            icon: 'mdi-numeric-2-circle',
            // avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/app_widgets/scale_icon.svg',
            notify: 'Specify all requirement amounts',
            disable: () => {
              return !(typeof this.form.minTotal === 'number' && typeof this.form.maxTotal === 'number' && typeof this.form.min === 'number' && typeof this.form.max === 'number');
            }
          },
          {
            label: 'Offering',
            icon: 'mdi-numeric-3-circle',
            avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/app_widgets/treasure_icon.svg',
            disable: () => true,
            notify: 'Select a resource to offer'
          },
          {
            label: 'Specs',
            tooltip: 'Here\'s a tooltip',
            icon: 'mdi-numeric-4-circle',
            // avatar: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/app_widgets/contract_icon.svg',
            disable: () => {
              return false;
            },
            notify: 'Include score filter'
          }
        ];
      }
    },
    methods: {
      handleInput(val){
        console.log('imagges', val, this.form.images);
      }
    }
  };
</script>

<style scoped>

</style>
