<template>
  <q-page flat style="max-width: 100%" class="bg-light flex flex-center q-pa-md">
    <q-card style="width: 1000px; max-width: 100%;" class="q-pa-md">
      <div class="q-pa-md" style="width: 100%;">
        <q-img style="width: 100%; height: 225px;" :src="getAvatar(form, 'profileBanner', 'large')">
          <q-btn class="t-r text-white" style="background: rgba(0,0,0,.3)" size="sm" flat icon="mdi-image"
                 label="cover image" @click="profileBannerDialog = true"></q-btn>
        </q-img>
        <div class="t-l q-ma-sm">
          <default-avatar :bg-in="primaryColor" style="width: 150px; height: 150px" :value="form" size-in="150px"
                          bordered/>
        </div>
      </div>
      <div class="row justify-center" v-if="form && form._id">
        <link-card class-in="q-mx-sm" style-in="width: 400px; max-width: 80%" sub-title-color="nice" icon-color="primary" text-color="nice" under-title="Share Me" :url="url"></link-card>
      </div>
      <div class="q-mt-sm q-pa-md"
           style="width: 100%; padding: 0 16px; display: flex; flex-direction: row; align-items: center; justify-content: space-between">
        <div class="row items-center">
          <p style="font-size: 32px; font-weight: 700">{{ form.name }}</p>
          <p class="q-ml-xs" style="font-size: 21px; color: #555555">
            @{{ lget(form, '_fastjoin.user.username', canEdit ? lget(user, 'username') : '') }}</p>
        </div>
        <div>
          <q-btn icon="edit" round flat @click="editProfile"/>
        </div>
      </div>
      <div class="q-pa-md" style="width: 100%; padding: 0;">

      </div>
      <div class="q-pa-md" style="width: 100%; padding: 0 16px;">
        <p style="font-size: 24px; color: #222222">{{ form.title }}</p>
      </div>
      <div class="q-pa-md" style="width: 100%; padding: 0 16px;">
        <p style="font-size: 21px; color: #555555">{{ form.description }}</p>
      </div>
      <div class="row q-pa-md">
        <div v-for="(link, i) in lget(form, 'links', [])" :key="`link-${i}`" class="flex flex-center q-px-sm">
          <a class="linkStyle" target="_blank" :href="getLink(lget(link, 'link', 'legacycoin.co'))">
            <q-icon size="sm" flat class="q-mx-sm" style="color: #555555;" :name="link.icon"/>
            {{ link.label }}
          </a>
          <q-separator v-if="i < form.links.length -1" vertical></q-separator>
          <q-btn size="xs" flat dense icon="mdi-pencil" class="q-mx-sm" @click.stop="editLinks(i)" v-if="canEdit"></q-btn>
        </div>
        <div class="q-my-md" style="width: 100%; display: flex; flex-direction: column">
          <div class="row" style="width: 100%; display: flex; justify-content: space-between">
            <p style="font-size: 24px;">Links
              <q-icon name="link"/>
            </p>
            <q-btn v-if="canEdit" @click="editLinks(-1)" icon="add" flat/>
          </div>

        </div>
      </div>

      <div class="__rep_card" v-for="(scoreType, i) in scoreTypes" :key="`score-type-${i}`">
        <q-btn v-if="canEdit" class="t-r" dense flat icon="mdi-plus"
               @click="reputationDialog = scoreType.value"></q-btn>
        <reputation-list
          @rmv="form.scores.splice($event, 1)"
          flat
          :queryIn="{ _id: { $in: lget(form, 'scores', [])}, type: scoreType.value }"
          service-in="fc-score-issue"
          :title="scoreType.label"
        ></reputation-list>

      </div>


      <div class="q-pa-md row justify-end" v-if="canEdit">
        <q-btn color="primary" label="save" icon="mdi-content-save" @click="saveResume"></q-btn>
      </div>

    </q-card>


    <q-dialog :value="reputationDialog ? true : false" @input="val => !val ? reputationDialog = false : ''">
      <q-card style="width: 500px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-white" dense flat size="sm" icon="mdi-close"
               @click="reputationDialog = false"/>
        <pick-item
          :queryIn="{ _id: { $in: this.lget(this.form, 'scores', [])}, type: reputationDialog }"
          multiple
          emit-value
          service-in="fc-score-issue"
          :type-in="reputationDialog"
          v-model="form.scores"
          @input="reputationDialog = false"
        ></pick-item>
      </q-card>
    </q-dialog>

    <q-dialog v-model="linkDialog">
      <q-card style="width: 500px; max-width: 100vw">
        <q-btn class="t-r-f bg-dark text-light" dense flat size="sm" icon="mdi-close" @click="linkDialog = false"/>
        <link-form @rmv="form.links.splice(linkIndex, 1)" :value="linkIndex > -1 ? form.links[linkIndex] : null"
                   @input="linkIndex > -1 ? form.links[linkIndex] = $event : form.links.push($event)"></link-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="edit">
      <q-card style="width: 100%; max-width: 650px">
        <div class="q-pa-md">
          <h4>Edit Profile</h4>
        </div>
        <div class="q-pa-md">
          <q-expansion-item
            expand-separator
            icon="image"
            label="Profile Image"
          >
            <q-card>
              <div class="q-pa-md">
                <single-image-upload style="width: 175px; height: 175px" add-label="Profile Photo"
                                     v-model="form.avatar"/>
              </div>
            </q-card>
          </q-expansion-item>
          <q-expansion-item
            expand-separator
            icon="image"
            label="Banner Image"
          >
            <q-card>
              <div class="q-pa-md">
                <single-image-upload style="width: 100%; " add-label="Banner Photo" v-model="form.profileBanner"/>
              </div>
            </q-card>
          </q-expansion-item>
        </div>
        <div class="row q-pa-md">
          <div style="width: 45%">
            <q-input v-model="form.name" input-class="text-sm text-mb-sm text-weight-medium" label="Name"></q-input>
          </div>
          <q-space/>
          <div style="width: 45%">
            <q-input input-class="text-sm text-mb-sm text-weight-medium" hide-bottom-space label="Email"
                     v-model="form.email"
                     :rules="[emailRule(form.email)]">
              <template v-slot:append>
                <q-btn flat round icon="mdi-email-check" color="primary"/>
              </template>
            </q-input>
          </div>
        </div>
        <div class="row justify-end q-px-sm">
          <div>
            <div class="q-pa-sm text-xxs text-mb-xs text-weight-bold">Privacy</div>
          <privacy-picker color="accent" v-model="form.privacy"></privacy-picker>
          </div>
        </div>
        <div class="q-pa-md">
          <div>
            <q-input v-model="form.title" input-class="text-sm text-mb-sm text-weight-medium" label="Profile Title"/>
          </div>
          <div>
            <q-input filled v-model="form.description" type="textarea" input-class="text-sm text-mb-sm text-weight-medium"
                     label="Profile Description"/>
          </div>
        </div>

        <div class="q-pa-md row justify-end">
          <q-btn color="primary" label="save" icon="mdi-content-save" @click="saveResume"></q-btn>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="profileBannerDialog">
      <single-image-upload add-label="Add Cover Image" v-model="form.profileBanner"></single-image-upload>
    </q-dialog>

  </q-page>
</template>

<script>
  import {models} from 'feathers-vuex';
  import {mapGetters} from 'vuex';
  import SingleImageUpload from '../../../common/substance/images/SingleImageUpload';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import LinkForm from 'components/common/links/LinkForm';
  import ReputationList from 'components/family-pod/reputation/cards/ReputationList';
  import PickItem from 'components/family-pod/reputation/forms/PickItem';
  import LinkCard from 'components/common/atoms/LinkCard';
  import PrivacyPicker from 'components/common/atoms/pickers/PrivacyPicker';

  export default {
    name: 'Profile',
    components: {
      PrivacyPicker,
      LinkCard,
      PickItem,
      ReputationList,
      LinkForm,
      DefaultAvatar,
      SingleImageUpload
    },
    props: {
      cols: {
        type: Number,
        default: 12
      },
      value: Object
    },
    mounted() {
      if (this.value) this.form = new models.api.Resumes(this.value).clone();
      else this.form = new models.api.Resumes({
        name: this.lget(this.user, 'name'),
        email: this.lget(this.user, 'email'),
        user: this.user._id,
        avatar: this.lget(this.user, 'avatar')
      }).clone();
    },
    data() {
      return {
        linkIndex: -1,
        reputationDialog: false,
        profileBannerDialog: false,
        edit: false,
        linkDialog: false,
        dirty: [],
        adding: null,
        selectedSuggestion: '',
        form: {},
        preferredCountries: ['NG', 'US'],
      };
    },
    watch: {
    },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      url(){
        return `${process.env.VUE_APP_URL ? process.env.VUE_APP_URL : 'https://www.legacycoin.co'}/resume/${this.form._id}`;
      },
      canEdit() {
        return !this.lget(this.form, 'user') || this.lget(this.form, 'user') === this.lget(this.user, '_id');
      },
      links() {
        return this.user.links;
      },
      scoreTypes(){
        return [
          {
            label: 'Peer Scores',
            value: 'peer',
          },
          {
            label: 'Credentials',
            value: 'credential',
          },
          {
            label: 'Experiences',
            value: 'experience',
          }
        ];
      },
      resumes() {
        //comeback for a find
        return this.findResume({
          query: {
            user: this.user._id,
            active: true
          }
        }).data.map(a => a.clone());
      },
      primaryColor() {
        return this.lget(this.form, 'primaryColor', 'secondary');
      }
    },
    methods: {
      getLink(link){
        if(link.indexOf('http') > -1) return link;
        else return 'https://' + link;
      },
      editLinks(i) {
        this.linkIndex = i;
        this.linkDialog = !this.linkDialog;
      },
      editProfile() {
        this.edit = !this.edit;
      },
      isEmailRule(val) {
        let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
        return reg.test(val);
      },
      async saveResume() {
        let email = this.emailRule(this.form.email);
        if (email) {
          await this.form.save()
            .then(res => {
              console.log('got res', res);
              this.edit = false;
              this.$successNotify('Nice Profile!');
              this.$emit('save');
            }).catch(err => {
              this.$errNotify(err.message);
            });
        } else {
          this.$infoNotify('Enter a valid email');
        }
      },
      setPhone(number, isValid) {
        console.log('set phone', number, isValid);
        if (isValid.isValid) {
          this.form.phone = isValid;
        }
      }
    }
  };
</script>

<style scoped>
  .linkStyle {
    text-decoration: none
  }

  .__rep_card {
    position: relative;
    box-shadow: 0 0 2px rgba(0, 0, 0, .4);
    margin: 15px 5px;
    border-radius: 5px;
    background: #eeeeee;
  }

</style>
