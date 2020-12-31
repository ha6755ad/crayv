import { models } from 'feathers-vuex';

const Fingerprint = {
  // eslint-disable-next-line no-unused-vars
  install (Vue, options){
    Vue.mixin({
      methods: {
        getFingerprint(){
          let navigator_info = window.navigator;
          let screen_info = window.screen;
          let uid = navigator_info.mimeTypes.length;
          uid += navigator_info.userAgent.replace(/\D+/g, '');
          uid += navigator_info.plugins.length;
          uid += screen_info.height || '';
          uid += screen_info.width || '';
          uid += screen_info.pixelDepth || '';
          return uid;
        },
        async $generateContact(path){
          let contact = new models.api.LLContacts().clone();
          contact.fingerprint = this.getFingerprint();
          await this.$store.dispatch('ll-contacts/find', {
            query: {
              fingerprint: contact.fingerprint
            }
          })
            .then(async res => {
              if(this.lget(res, 'data', []).length) {
                this.$infoNotify('Looks like we\'ve already met');
                return this[path] = this.$arrayFilterZero(res.data);
              } else {
                await contact.save()
                  .then(contactResponse => {
                    return this[path] = contactResponse.clone();
                  })
                  .catch(err => {
                    this.$errNotify(`Error creating contact - ${err.message}`);
                  });
              }
            })
            .catch(err => {
              this.$errNotify(`Error searching contacts - ${err.message}`);
            });
        }
      }
    });
  }
};

export default Fingerprint;
