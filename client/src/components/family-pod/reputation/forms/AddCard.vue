<template>
  <q-card flat class="q-pa-md">

    <q-btn size="sm" class="t-r" v-if="form._id" @click="remove" icon="mdi-delete" dense flat></q-btn>

    <div class="flex">
      <q-radio keep-color v-for="(tp, i) in types" :key="`type-${i}`" :label="tp.label" v-model="form.type"
               :val="tp.value" :color="form.type === tp.value ? 'accent' : 'ir-blue-grey-3'"></q-radio>
    </div>


    <div class="text-sm text-mb-md text-weight-medium">{{ title }}</div>
    <q-separator class="q-my-sm"></q-separator>
    <div class="q-mb-xl text-xs text-mb-xs text-weight-light">{{ description }}</div>

    <div class="col-12 q-gutter-md">
      <div class="row justify-center">
        <single-image-upload add-label="Add Image" v-model="form.avatar"></single-image-upload>
      </div>
      <q-input v-model="form.name" placeholder="Name"></q-input>
      <q-input v-model="form.description" placeholder="Description" :maxlength="50" counter></q-input>
      <div>
        <div class="text-xs text-mb-xs text-weight-medium">
          Privacy: <span class="text-weight-light">choose who can share and assign this score.</span>
        </div>
        <privacy-picker show-description v-model="form.privacy"></privacy-picker>
      </div>
      <tag-picker adding v-model="form.tags" :service-in="service"></tag-picker>
    </div>
    <div class="row justify-end q-pa-md">
      <q-btn push label="save" @click="saveItem" icon="mdi-content-save" color="blue"></q-btn>
    </div>
  </q-card>
</template>

<script>
  import {models} from 'feathers-vuex';
  import TagPicker from 'components/common/atoms/pickers/TagPicker';
  import SingleImageUpload from 'components/common/substance/images/SingleImageUpload';
  import {mapGetters} from 'vuex';
  import {vCheck} from 'src/Mixins/ir-validate';
  import PrivacyPicker from 'components/common/atoms/pickers/PrivacyPicker';

  export default {
    name: 'AddCard',
    components: { PrivacyPicker, SingleImageUpload, TagPicker },
    mixins: [vCheck],
    props: {
      value: Object
    },
    mounted() {
      let modelService = models.api.byServicePath[this.service];
      if (this.value) this.form = new modelService(this.value).clone();
      else this.form = new modelService().clone();
    },
    data() {
      return {
        form: {}
      };
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      types() {
        return [
          { label: 'Peer Score', value: 'peer' },
          { label: 'Credential', value: 'credential' },
          { label: 'Experience', value: 'experience' },
        ];
      },
      service() {
        return 'fc-scores';
      },
      title() {
        if (this.form._id) {
          return this.form.name;
        } else {
          return 'Create ' + this.$arrayFilterZero(this.types.filter(a => a.value === this.form.type), 'Score', 'label');
        }
      },
      description() {
        switch (this.form.type) {
          case('peer'):
            return 'Scores are scorable skills that you can perform that can be rated and validated by your peers.';
          case('credential'):
            return 'Credentials are standards issued by people or organizations that have common requirements which, if accomplished, result in eligiblity for credentials.';
          case('experience'):
            return 'Experiences are the various things you experience that can be reflected in your character. They can be personal hobbies, important professional endeavors, or any describable experience.';
          default:
            return 'choose type';
        }
      },
      validCheck() {
        return {
          name: { name: 'Name', v: ['notEmpty', 'type:string'] },
          description: { name: 'Description', v: ['notEmpty', 'type:string'] },
          avatar: { name: 'Image', v: ['notEmpty', 'type:object'] }
        };
      },
    },
    methods: {
      async saveItem() {
        const errors = this.$vCheck(this.form);
        if (errors && errors.length) {
          errors.forEach(err => {
            this.$vErrNotify(err);
          });
        } else {
          this.form.issuer = this.user._id;
          this.form.issuerModel = 'users';
          await this.form.save()
            .then(res => {
              this.$successNotify('Score Saved');
              this.$emit('input', res);
            }).catch(err => {
              this.$errNotify('Error saving ' + err.message);
            });
        }
      },
      remove() {
        this.$q.dialog({
          title: `Remove ${this.form.name}?`,
          ok: {
            size: 'sm',
            color: 'positive',
            push: true,
            label: 'Yes'
          },
          cancel: {
            size: 'sm',
            color: 'negative',
            label: 'cancel',
            flat: true
          }
        }).onOk(() => {
          if (this.lget(this.form, 'members', []).length) {
            this.$store.dispatch('bw-channels/patch', [this.form._id, {
              $pull: { members: this.user._id }
            }]);
          } else {
            this.$store.dispatch('bw-channels/remove', this.form._id);
          }
        });
      },
    }
  };
</script>
