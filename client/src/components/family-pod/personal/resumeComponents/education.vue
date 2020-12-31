<template>
  <div class="container">
    <q-card flat bordered >
      <q-card-section style="padding: 0; display: flex; flex-direction: row; justify-content: space-between; align-items: center">
        <div>
          <p class="q-pl-sm" style="font-size: 24px">Education</p>
        </div>
        <div class="q-ma-md">
          <q-btn flat round icon="add" @click="newEd()" />
        </div>
      </q-card-section>
      <q-card-section style="width: 100%;" v-for="(item, i) in items" :key="i" >
        <div style="display: flex; flex-direction: row; align-items: center">
          <div>
            <img :src="item.institutionImg.large.file" style="width: 100px; height: 100px" />
          </div>
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
            <div class="q-mx-md">
              <p style="font-size: 20px; font-weight: 700">{{ item.institution }}</p>
              <div style="display: flex; flex-direction: row">
              <p style="font-size: 17px; ">{{ item.area }} </p><p style="font-size: 17px">&middot; {{ item.studyType }} </p><p style="font-size: 17px">&middot;
                {{item.gpa}} </p>
              </div>
              <p style="font-size: 17px; color: #848484">{{ item.startDate }} - {{ item.endDate }}</p>
            </div>
            <div class="row" style="display: flex; align-items: center">
              <div >
                <q-btn style="color: #848484" flat @click="editEd(item, i)" icon="edit" round />
              </div>
              <div >
                <q-btn style="color: #848484" flat @click="deleteThis(item)" icon="delete" round />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="deleteItem">
      <q-card>
        <q-card-section>
          <p>Are you sure you want to delete?</p>
        </q-card-section>
        <q-card-section style="width: 100%; display: flex; flex-direction: row; justify-content: flex-end">
          <div>
            <q-btn flat label="No" />
          </div>
          <div>
            <q-btn class="q-ml-md" label="Yes" @click="deleteEd" color="green" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog" @hide="hideDialog">
      <q-card style="width: 100%; max-width: 500px;">
        <q-card-section>
          <p v-if="edit" style="font-size: 36px; padding-bottom: 0">Edit Education</p>
          <p v-else style="font-size: 36px; padding-bottom: 0">Add Experience</p>
        </q-card-section>
        <q-card-section>
          <div style="width: 100%; display: flex; justify-content: center">
            <single-image-upload style="width: 100px; height: 100px" add-label="Institute Logo" v-model="form.institutionImg" />
          </div>
        </q-card-section>
        <q-card-section style="padding-top: 0; display: flex; flex-direction: row; justify-content: center">
          <div style="width: 50%">
            <q-input style="width: 90%" label="Institute Name" v-model="form.institution" />
          </div>
          <q-space />
          <div style="width: 50%">
            <q-input style="width: 90%" label="Area of Study" v-model="form.area" />
          </div>
        </q-card-section>
        <q-card-section style="padding-top: 0; display: flex; flex-direction: row; justify-content: center">
          <div style="width: 50%">
            <q-input style="width: 90%" label="Start Date" placeholder="Ex. Feb 2019" v-model="form.startDate" />
          </div>
          <q-space />
          <div style="width: 50%">
            <q-input style="width: 90%" label="End Date" placeholder="Ex. Feb 2019" v-model="form.endDate" >
              <q-tooltip>
                Input "Present" if currently enrolled.
              </q-tooltip>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section style="padding-top: 0; display: flex; justify-content: center">
          <div style="width: 50%;">
            <q-input style="width: 90%;" label="Degree"  v-model="form.studyType" />
          </div>
          <div style="width: 50%;">
            <q-input style="width: 90%;" type="number" label="GPA"  v-model="form.gpa" />
          </div>
        </q-card-section>
        <q-card-section>
          <div style="width: 100%; display: flex; justify-content: flex-end">
            <q-btn color="green" label="Save" @click="saveEd" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
  import SingleImageUpload from '../../../common/substance/images/SingleImageUpload';
  import {mapActions} from 'vuex';
  import {models} from 'feathers-vuex';

  const newForm = {
    institutionImg: {
      large: {
        _id: '',
        file: ''
      }
    },
    institution: '',
    area: '',
    studyType: '',
    startDate: '',
    endDate: '',
    gpa: null,
  };
  export default {
    name: 'education',
    components: {SingleImageUpload},
    props: {
      resume: {
        type: Array
      }
    },
    data() {
      return {
        edit: false,
        dialog: false,
        deleteItem: false,
        index: null,
        tempObj: {},
        form: {
          institutionImg: {
            large: {
              _id: '',
              file: ''
            }
          },
          institution: '',
          area: '',
          studyType: '',
          startDate: '',
          endDate: '',
          gpa: null,
        }
      };
    },
    computed: {
      userResume () {
        return this.resume.find( res => res.user === this.user._id);
      },
      items() {
        return this.userResume?.education;
      },
    },
    methods: {
      ...mapActions('resumes', {
        patchResume: 'patch'
      }),
      testing() {
        console.log('this is the val');
      },
      newEd () {
        this.form = newForm;
        this.dialog = !this.dialog;
      },
      hideDialog() {
        this.edit = false;
        this.index = null;

      },
      editEd (val, i) {
        this.form = val;
        this.edit = true;
        this.index = i;
        this.dialog = !this.dialog;
      },
      deleteThis(val){
        this.tempObj = val;
        this.deleteItem = !this.deleteItem;
      },
      deleteEd () {
        let b = this.userResume.education.filter( res => {
          return res._id !== this.tempObj._id;
        });
        console.log('this is the b', b);
        this.patchResume([this.userResume._id, {education: b}])
          .then ( res => {
            console.log('got res', res);
            this.$successNotify('Lookin Good!');
            this.deleteItem =!this.deleteItem;
            this.tempObj = {};
          })
          .catch(err => {
            console.log('somethings wrong', err);
            this.$errNotify(err.message);
          });
      },
      saveEd() {
        //check if the user even has a resume on their profile
        if (this.resume.length > 0) {
          //check if they are editing or not
          if (this.edit === true) {
            //edit experience and save
            this.userResume.education[this.index] = this.form;
            this.userResume.save()
              .then(res => {
                console.log('got res', res);
                this.$successNotify('Lookin Good!');
                this.dialog = !this.dialog;
                this.form = newForm;
                this.index = null;
              })
              .catch(err => {
                this.$errNotify(err.message);
              });
          } else {
            //if they want to add a new job
            this.userResume.education.push(this.form);
            console.log('this is after pushing to the user resume', this.userResume);
            this.userResume.save()
              .then(res => {
                console.log('got res', res);
                this.$successNotify('Lookin Good!');
                this.dialog = !this.dialog;
                this.form = newForm;
              }).catch(err => {
                this.$errNotify(err.message);
              });
          }
        } else {
          //if they dont have a resume yet
          let payload = {
            name: this.user.name,
            user: this.user._id,
            education: this.form
          };
          let b = new models.api.Resumes(payload).clone();
          b.save()
            .then(res => {
              console.log('got res', res);
              this.$successNotify('Lookin Good!');
              this.form = newForm;
              this.dialog = !this.dialog;
            }).catch(err => {
              this.$errNotify(err.message);
            });
        }
      }
    }
  };
</script>

<style scoped>

</style>
