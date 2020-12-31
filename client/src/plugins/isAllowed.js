import {mapState} from 'vuex';

const isAllowed = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.mixin({
      computed: {
        ...mapState('auth', { user: 'user' }),
        // rulesList(){
        //   return this.findRules({
        //     query: {
        //       _id: {
        //         $in: this.userFilter
        //       }
        //     }
        //   }).data
        // },
        rulesList() {
          return [];
          // let roles = this.lget(this.user, '_fastjoin.roles', []);
        },
        userFilter() {
          if (this.lget(this.user, '_fastjoin.roles', []).length) {
            let list = [].concat.apply([], this.user._fastjoin.roles.map(r => this.lget(r, '_fastjoin.rules')));
            return list;
          } else return [];
        }
      },
      methods: {
        isWhitelist(email){
          return ['tyler@ionrev.com', 'tyler1@ionrev.com', 'dev@ionrev.com', 'bryce@ionrev.com'].includes(email);
        },
        $isSuperAdmin(host) {
          let admin = this.lget(host, 'roles.superadmin', []);
          return admin.includes(this.lget(this.user, '_id'));
        },
        $isAdmin(host) {
          let admin = this.lget(host, 'roles.admin', []);
          return admin.includes(this.lget(this.user, '_id'));
        },
        // eslint-disable-next-line no-unused-vars
        isAllowed(actions, subjects) {
          // console.log('allowing', actions, subjects, this.userFilter, this.rulesList);
          let boo = false;
          this.userFilter.forEach(a => {
            !actions.some(act => !a.actions.includes(act)) && !subjects.some(subj => !a.subject.includes(subj)) ? boo = true : '';
          });
          return boo;
        },
        // eslint-disable-next-line no-unused-vars
        isMember(community, level, personId) {
          return true;
          // if(community?.members?[level]?.length && personId){
          //   return community.members[level].includes(personId)
          // } else return false
        }
      }
    });
  }
};

export default isAllowed;
