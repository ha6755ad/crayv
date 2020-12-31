<template>
  <q-card flat>
    <q-item>
      <q-item-section avatar>
        <default-avatar :value="verifying">
          <template v-slot:menu>
            <q-menu>
              <detail-card :value="verifying"/>
            </q-menu>
          </template>
        </default-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-xs text-mb-sm text-weight-light">
          Verification Request for <span class="text-weight-medium">{{lget(verifying, 'name', lget(verifying, 'username'))}}</span>
        </q-item-label>
        <q-item-label class="text-xxs text-mb-xs text-weight-light">
          Be careful, make sure you know this person is who they are saying
        </q-item-label>
        <q-item-label>
          <div class="row q-my-sm" v-if="lget(verify, 'status') === 'open'">
            <q-btn size="sm" flat icon="mdi-close" @click="reject" label="Reject" color="negative"/>
            <q-btn size="sm" flat icon="mdi-check" @click="approve" label="Approve" color="positive"/>
          </div>
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-btn v-if="lget(verify, 'image')" flat @click="imageDialog = true" color="primary" size="sm" label="see image" icon="mdi-image"/>
      </q-item-section>
    </q-item>

    <q-dialog v-model="imageDialog">
      <q-card>
        <q-img style="height: 200px; width: 200px" :src="verify.image"/>
      </q-card>
    </q-dialog>

    <q-dialog v-model="rejectDialog">
      <q-card style="width: 450px; max-width: 95vw" class="q-pa-md">
        <div class="row justify-center q-mb-sm">
          <default-avatar :value="verifying"/>
        </div>
        <div class="text-xs text-mb-sm text-weight-medium">
          Reject Verification of {{lget(verifying, 'name', lget(verifying, 'username'))}}
        </div>
        <q-separator/>
        <div class="text-xxs text-mb-xs text-weight-light">Please select a reason for rejection</div>

        <q-radio label="This request is no longer valid" :val="'closed'" v-model="rejectReason"/>
        <q-radio label="I believe this is not a valid person or is the wrong person" :val="'fraud'" v-model="rejectReason"/>

        <template>
          <div class="q-mt-md text-xxs text-mb-xs text-weight-light">Please indicate your level of certainty that this is the wrong person (1 being not sure, 5 being positively certain)</div>

        <div v-if="rejectReason === 'fraud'" class="row justify-center q-my-sm">
          <q-btn-group rounded>
            <q-btn push v-for="i in 5" :key="`btn-${i}`" :label="i" @click="certainty = i" :color="certainty === i ? 'primary' : 'grey-6'"/>
          </q-btn-group>
        </div>
        </template>

        <q-separator class="q-my-lg"/>

        <div class="row justify-end">
          <q-btn color="primary" push label="submit rejection" @click="signRejection(verify)" icon="mdi-check"/>
        </div>
      </q-card>
    </q-dialog>

    <q-dialog v-model="approveDialog">
      <q-card style="width: 450px; max-width: 95vw" class="q-pa-md">
        <div class="row justify-center q-mb-sm">
          <default-avatar :value="verifying"/>
        </div>
        <div class="text-xs text-mb-sm text-weight-medium">
          Verify {{lget(verifying, 'name', lget(verifying, 'username'))}}
        </div>
        <q-separator/>
        <div class="text-xxs text-mb-xs text-weight-light">Please select how confident you are this is authenitcally (1 being not sure, 5 being positively certain){{lget(verifying, 'name', lget(verifying, 'username'))}}</div>


        <div class="row justify-center q-my-sm">
        <q-btn-group rounded>
          <q-btn push v-for="i in 5" :key="`btn-${i}`" :label="i" @click="certainty = i" :color="certainty === i ? 'primary' : 'grey-6'"/>
        </q-btn-group>
        </div>

        <q-separator class="q-my-lg"/>


        <div class="row justify-end">
          <q-btn color="primary" push label="submit approval" @click="signAcceptance(verify)" icon="mdi-check"/>
        </div>
      </q-card>
    </q-dialog>

  </q-card>
</template>

<script>
  import { mapGetters } from 'vuex';
  import DefaultAvatar from 'components/common/atoms/avatars/DefaultAvatar';
  import DetailCard from 'components/common/atoms/users/DetailCard';
  import encrypt from '../../../../plugins/encrypt';
  import GetKey from 'components/login/verify/GetKey';
  export default {
    name: 'InAppMessages',
    components: { DetailCard, DefaultAvatar },
    props: {
      verify: Object
    },
    data(){
      return {
        certainty: 1,
        approveDialog: false,
        rejectReason: 'fraud',
        referrerKey: null,
        imageDialog: false,
        rejectDialog: false
      };
    },
    watch: {
      user: {
        immediate: true,
        async handler(newVal){
          if(newVal && newVal._id) {
            await this.$store.dispatch('fc-signing-keys/find', {
              query: {
                user: newVal._id,
                active: true
              }
            }).then(res => {
              this.referrerKey = this.lget(res, ['data', 0]);
            });
          }
        }
      }
    },
    computed: {
      ...mapGetters('auth', {user: 'user'}),
      verifying(){
        return this.lget(this.verify, 'fullVerifying');
      },
      verifying_key(){
        return this.lget(this.verify, 'fullVerifyingKey');
      },
      user_key(){
        return this.lget(this.verify, 'fullUserKey');
      }

    },
    methods: {
      reject() {
        this.rejectDialog = true;
      },
      approve(){
        this.approveDialog = true;
      },
      signAcceptance(verify){
        this.$q.dialog({
          component: GetKey,
          persistent: true,
          parent: this,
          signingKey: this.user_key
        }).onOk(key => {

          let pubKey = encrypt.decodeBase64(this.user_key.key);
          let privKey = key;
          let nonce = encrypt.decodeBase64(this.user_key.token);
          let message = this.uuid();
          let signature = encrypt.encryptString(encrypt.decodeUTF8(message), nonce, pubKey, privKey);

          this.$store.dispatch('fc-verify/patch', [verify._id, {
            user: verify.user,
            signature: encrypt.encodeBase64(signature),
            status: 'verified',
            certainty: this.certainty
          }]).then(res => {
            console.log('verifies', res);
            this.$successNotify('Verified');
          }).catch(err => {
            console.log('Error accepting', err);
          });
        }).onCancel(() => {
          this.$infoNotify('Signing cancelled');
        });
      },
      signRejection(verify){
        this.$q.dialog({
          component: GetKey,
          persistent: true,
          parent: this,
          signingKey: this.user_key
        }).onOk(key => {

          let pubKey = encrypt.decodeBase64(this.user_key.key);
          let privKey = key;
          let nonce = encrypt.decodeBase64(this.user_key.token);
          let message = this.uuid();
          let signature = encrypt.encryptString(encrypt.decodeUTF8(message), nonce, pubKey, privKey);

          this.$store.dispatch('fc-verify/patch', [verify._id, {
            user: verify.user,
            signature: encrypt.encodeBase64(signature),
            status: this.rejectReason,
            certainty: this.certainty
          }]).then(res => {
            console.log('rejected', res);
            this.$successNotify('Rejected Verification');
          }).catch(err => {
            console.log('error rejecting', err);
          });
        }).onCancel(() => {
          this.$infoNotify('Signing cancelled');
        });
      }
    }
  };
</script>
