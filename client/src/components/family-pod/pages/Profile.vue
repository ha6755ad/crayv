<template>
  <q-card flat>
    <q-card-section v-if="!$route.params.nav">
      <div class="row q-col-gutter-lg">
        <template v-for="(page, i) in profilePages">
          <div class="col-12 col-sm-6 col-md-4 col-lg-3" :key="`page-${i}`">
            <q-card class="pointer" @click="setRoute(page.route)">
              <q-card-section>
                <div class="row justify-center">
                  <template v-if="!page.icon">
                    <q-avatar size="80px" color="accent" :class="`text-${$getTextColor('--q-color-accent')}`">
                      <img v-if="page.avatar" :src="page.avatar">
                      <template v-else>
                        {{page.letter}}
                      </template>
                    </q-avatar>
                  </template>
                  <template v-else>
                    <q-icon size="80px" :name="page.icon" :color="page.color"></q-icon>
                  </template>
                </div>

                <div class="row justify-center text-md text-mb-md text-weight-medium">{{page.label}}</div>
                <div class="row justify-center text-xxs text-mb-xs text-weight-light text-italic">{{page.caption}}</div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </div>
    </q-card-section>
    <q-page>
      <component :is="componentOptions[$route.params.nav]"/>
    </q-page>
  </q-card>
</template>

<script>
  import {mapGetters} from 'vuex';
  import PersonalProfile from '../personal/PersonalProfile';
  import PaymentDetails from '../payment/PaymentDetails';

  export default {
    name: 'Profile',
    components: { PersonalProfile, PaymentDetails },
    computed: {
      ...mapGetters('auth', { user: 'user' }),
      person(){
        return this.user;
      },
      componentOptions() {
        return {
          'my-profile': PersonalProfile,
          'payment-details': PaymentDetails
        };
      },
      profilePages() {
        return [
          {
            label: 'Your Profile',
            caption: 'Account and contact information',
            avatar: this.getAvatar(this.person, 'avatars', null),
            letter: this.person.name.charAt(0),
            route: 'my-profile'
          },
          {
            label: 'Payment & Billing',
            caption: 'Payment and Billing preferences',
            icon: 'mdi-currency-usd-circle',
            route: 'payment-details'
          }
        ];
      }
    },
    methods: {
      setRoute(nav) {
        this.$router.push({ name: 'profile-page', params: { nav: nav } });
      }
    }
  };
</script>
