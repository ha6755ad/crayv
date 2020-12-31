<template>
  <div class="container">
    <q-card flat bordered >
      <q-card-section style="padding: 0; display: flex; flex-direction: row; justify-content: space-between; align-items: center">
        <div>
          <p class="q-pl-sm" style="font-size: 24px">License & Certifications</p>
        </div>
        <div class="q-ma-md">
          <q-btn flat round icon="add" @click="newLicense()" />
        </div>
      </q-card-section>
      <q-card-section style="width: 100%;" v-for="(item, i) in items" :key="i">
        <div style="display: flex; flex-direction: row; align-items: center">
          <div>
            <img :src="item.issuerImg.large.file" style="width: 100px; height: 100px" />
          </div>
          <div style="width: 100%; display: flex; justify-content: space-between; align-items: center">
            <div class="q-mx-md">
              <p style="font-size: 20px; font-weight: 700">{{ item.issuer}}</p>
              <div style="display: flex; flex-direction: row">
                <p style="font-size: 17px; ">{{ item.certificate }}</p>
              </div>
              <p style="font-size: 17px; color: #848484">Issued: {{item.dateReceived}} - Expiration: {{ item.expirationDate }}</p>
            </div>
            <div class="row" style="display: flex; align-items: center">
              <div >
                <q-btn style="color: #848484" flat @click="editLicense(item, i)" icon="edit" round />
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
            <q-btn class="q-ml-md" label="Yes" @click="deleteLicense" color="green" />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="dialog" @hide="hideDialog">
      <q-card style="width: 100%; max-width: 500px;">
        <q-card-section>
          <p v-if="edit" style="font-size: 36px; padding-bottom: 0">Edit License & Certification</p>
          <p v-else style="font-size: 36px; padding-bottom: 0">Add License & Certification</p>
        </q-card-section>
        <q-card-section>
          <div style="width: 100%; display: flex; justify-content: center">
            <single-image-upload style="width: 100px; height: 100px" add-label="Issuer Logo" v-model="form.issuerImg" />
          </div>
        </q-card-section>
        <q-card-section style="padding-top: 0; display: flex; flex-direction: row; justify-content: center">
          <div style="width: 50%">
            <q-input style="width: 90%" label="Institute Name" v-model="form.issuer" />
          </div>
          <q-space />
          <div style="width: 50%">
            <q-input style="width: 90%" label="License/Certificate"  v-model="form.certificate" />
          </div>
        </q-card-section>
        <q-card-section style="padding-top: 0; display: flex; flex-direction: row; justify-content: center">
          <div style="width: 50%">
            <q-input style="width: 90%" label="Date Issued" placeholder="Ex. Feb 2019" v-model="form.dateReceived" />
          </div>
          <q-space />
          <div style="width: 50%">
            <q-input style="width: 90%" label="Expiration Date" placeholder="Ex. Feb 2019" v-model="form.expirationDate" >
              <q-tooltip>
                Input "No Expiration" if no expiration.
              </q-tooltip>
            </q-input>
          </div>
        </q-card-section>
        <q-card-section>
          <div style="width: 100%; display: flex; justify-content: flex-end">
            <q-btn color="green" label="Save" @click="saveLicense" />
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
    issuerImg: {
      large: {
        _id: '',
        file: ''
      }
    },
    issuer: '',
    certificate: '',
    dateReceived: '',
    expirationDate: '',
  };
  export default {
    name: 'license',
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
          issuerImg: {
            large: {
              _id: '',
              file: ''
            }
          },
          issuer: '',
          certificate: '',
          dateReceived: '',
          expirationDate: '',
        }
      };
    },
    computed: {
      userResume () {
        return this.resume.find( res => res.user === this.user._id);
      },
      items() {
        return this.userResume?.license;
      },
    },
    methods: {
      ...mapActions('resumes', {
        patchResume: 'patch'
      }),
      testing() {
        console.log('this is the val');
      },
      newLicense () {
        this.form = newForm;
        this.dialog = !this.dialog;
      },
      hideDialog() {
        this.edit = false;
        this.index = null;

      },
      editLicense (val, i) {
        this.form = val;
        this.edit = true;
        this.index = i;
        this.dialog = !this.dialog;
      },
      deleteThis(val){
        this.tempObj = val;
        this.deleteItem = !this.deleteItem;
      },
      deleteLicense () {
        let b = this.userResume.license.filter( res => {
          return res._id !== this.tempObj._id;
        });
        console.log('this is the b', b);
        this.patchResume([this.userResume._id, {license: b}])
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
      saveLicense() {
        //check if the user even has a resume on their profile
        if (this.resume.length > 0) {
          //check if they are editing or not
          if (this.edit === true) {
            //edit experience and save
            this.userResume.license[this.index] = this.form;
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
            this.userResume.license.push(this.form);
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
            license: this.form
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
