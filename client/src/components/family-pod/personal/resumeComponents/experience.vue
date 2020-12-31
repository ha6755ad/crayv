<template>
    <div class="container">
      <q-card flat bordered >
        <q-card-section style="padding: 0; display: flex; flex-direction: row; justify-content: space-between; align-items: center">
          <div>
            <p class="q-pl-sm" style="font-size: 24px">Experience</p>
          </div>
          <div class="q-ma-md">
            <q-btn flat round icon="add" @click="newXP()" />
          </div>
        </q-card-section>
        <q-card-section v-for="(item, i) in items" :key="i" style="width: 100%;">
          <div style="display: flex; flex-direction: row; align-items: center">
            <div>
              <img :src="item.companyImg.large.file" style="width: 100px; height: 100px" />
            </div>
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
            <div class="q-mx-md">
              <p style="font-size: 20px; font-weight: 700">{{ item.company }}</p>
              <p style="font-size: 17px; ">{{ item.position }}</p>
              <p style="font-size: 17px; color: #848484">{{item.startDate}} - {{item.endDate}}</p>
            </div>
            <div class="row" style="display: flex; align-items: center">
              <div>
                <q-btn style="color: #848484" flat @click="editXP(item, i)" icon="edit" round />
              </div>
              <div >
                <q-btn style="color: #848484" flat @click="deleteThis(item)" icon="delete" round />
              </div>
              <div class="q-mx-lg">
                <q-icon size="sm" style="color: #848484" flat name="info" round >
                  <q-popup-proxy style="width: 100%; max-width: 500px" :offset="[10, 10]">
                    <q-card>
                      <q-card-section style="display: flex; flex-direction: row; align-items: center">
                        <p>Company Website: </p>
                        <a class="linkStyle" target="_blank" :href="item.website"><q-icon size="sm" flat class="q-mx-sm" style="color: #555555;" name="fas fa-code" /></a>
                      </q-card-section>
                      <q-card-section>
                        <q-input readonly label="Summary" :value="item.summary" type="textarea" />
                      </q-card-section>
                    </q-card>
                  </q-popup-proxy>
                </q-icon>
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
              <q-btn class="q-ml-md" label="Yes" @click="deleteXP" color="green" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-dialog v-model="dialog" @hide="hideDialog">
        <q-card style="width: 100%; max-width: 500px;">
          <q-card-section>
            <p v-if="edit" style="font-size: 36px; padding-bottom: 0">Edit Experience</p>
            <p v-else style="font-size: 36px; padding-bottom: 0">Add Experience</p>
          </q-card-section>
          <q-card-section>
            <div style="width: 100%; display: flex; justify-content: center">
              <single-image-upload style="width: 100px; height: 100px" v-model="form.companyImg" add-label="Company Logo" />
            </div>
          </q-card-section>
          <q-card-section style="padding-top: 0; display: flex; flex-direction: row; justify-content: center">
            <div style="width: 50%">
              <q-input style="width: 90%" v-model="form.company" label="Company Name" />
            </div>
            <q-space />
            <div style="width: 50%">
              <q-input style="width: 90%" v-model="form.position" label="Position" />
            </div>
          </q-card-section>
          <q-card-section style="padding-top: 0; display: flex; flex-direction: row; justify-content: center">
            <div style="width: 50%">
              <q-input style="width: 90%" v-model="form.startDate" label="Start Date" placeholder="Ex. Feb 2019" />
            </div>
            <q-space />
            <div style="width: 50%">
              <q-input style="width: 90%" v-model="form.endDate" label="End Date" placeholder="Ex. Feb 2019" >
                <q-tooltip>
                  Input "Present" if this is your current job.
                </q-tooltip>
              </q-input>
            </div>
          </q-card-section>
          <q-card-section style="padding-top: 0; display: flex; justify-content: center">
            <div style="width: 100%;">
              <q-input style="width: 100%;" v-model="form.website" label="Company Website" />
            </div>
          </q-card-section>
          <q-card-section style="padding-top: 0; display: flex; justify-content: center">
            <div style="width: 100%;">
              <q-input style="width: 100%;" v-model="form.summary" type="textarea" label="Summary" />
            </div>
          </q-card-section>
          <q-card-section>
            <div style="width: 100%; display: flex; justify-content: flex-end">
              <q-btn color="green" label="Save" @click="saveXP" />
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
</template>

<script>
  import {mapActions} from 'vuex';
  import {models} from 'feathers-vuex';
  import SingleImageUpload from '../../../common/substance/images/SingleImageUpload';

  const newForm = {
    companyImg: {
      large: {
        _id: '',
        file: ''
      }
    },
    company: '',
    position: '',
    website: '',
    startDate: '',
    endDate: '',
    summary: '',
  };
  export default {
    name: 'experience',
    components: {SingleImageUpload},
    props: {
      resume: {
        type: Array
      }
    },
    mounted() {
    },
    data() {
      return {
        edit: false,
        dialog: false,
        deleteItem: false,
        index: null,
        tempObj: {},
        form: {
          companyImg: {
            large: {
              _id: '',
              file: ''
            }
          },
          company: '',
          position: '',
          website: '',
          startDate: '',
          endDate: '',
          summary: '',
        }
      };
    },
    computed: {
      userResume () {
        return this.resume.find( res => res.user === this.user._id);
      },
      items() {
        return this.userResume?.work;
      },
    },
    methods: {
      ...mapActions('resumes', {
        patchResume: 'patch'
      }),
      testing() {
        console.log('this is the val');
      },
      newXP () {
        this.form = newForm;
        this.dialog = !this.dialog;
      },
      hideDialog() {
        this.edit = false;
        this.index = null;

      },
      editXP (val, i) {
        this.form = val;
        this.edit = true;
        this.index = i;
        this.dialog = !this.dialog;
      },
      deleteThis(val){
        this.tempObj = val;
        this.deleteItem = !this.deleteItem;
      },
      deleteXP () {
        let b = this.userResume.work.filter( res => {
          return res._id !== this.tempObj._id;
        });
        console.log('this is the b', b);
        this.patchResume([this.userResume._id, {work: b}])
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
      saveXP() {
        //check if the user even has a resume on their profile
        if (this.resume.length > 0) {
          //check if they are editing or not
          if (this.edit === true) {
            //edit experience and save
            this.userResume.work[this.index] = this.form;
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
            this.userResume.work.push(this.form);
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
            work: this.form
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
  .linkStyle {
    text-decoration: none;
  }

</style>
