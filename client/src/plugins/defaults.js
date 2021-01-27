const lget = require('lodash.get');
const { date } = require('quasar');
const { formatDate } = date;


module.exports = {
  // eslint-disable-next-line no-unused-vars
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          defaultImage: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/defaultImage.svg'
        };
      },
      computed: {
        $privacyObj() {
          return {
            private: {
              name: 'Private',
              description: 'only you',
              value: 'private',
              icon: 'mdi-lock'
            },
            public: {
              name: 'Public',
              description: 'anyone',
              value: 'public',
              icon: 'mdi-link'
            },
            permission: {
              name: 'By Permission',
              description: 'people you grant access to',
              value: 'permission',
              icon: 'mdi-key'
            }
          };
        }
      },
      methods: {
        $limitStr(string, limit, append){
          let apnd = append ? append : [false, null].includes(append) ? '' : '...';
          let appendLength = apnd ? JSON.stringify(apnd).length : 0;
          let stringLength = (string && typeof string === 'string') ? string.length : 0;
          if(limit && stringLength && stringLength > limit){
            return string.substring(0, limit - appendLength) + apnd;
          } else return string ;
        },
        $setForm(path, val){
          this.form[path] = val;
          this.dirty = true;
        },
        $routerPreserve({ name, params, query, path } = {}){
          let routerObj = {};
          if(name) routerObj.name = name;
          if(params) routerObj.params = params;
          if(query) routerObj.query = query;
          if(path) routerObj.path = path;
          let obj = {...this.$route, ...routerObj};
          this.$router.push(obj);
        },
        $arrMove(arr, fromIndex, toIndex, obj) {
          let cloneArr = JSON.parse(JSON.stringify(arr));
          cloneArr.splice(fromIndex, 1);
          cloneArr.splice(toIndex, 0, obj);
          return cloneArr;
        },
        $getFile(obj) {
          return this.lget(obj, 'file');
        },
        $isMember(user, group, idPath) {
          let path = idPath ? idPath : 'members';
          return this.lget(group, path, []).includes(this.lget(user, '_id'));
        },
        $getSquareHeight(window, padding, cols, smSize, mdSize, lgSize, xlSize) {
          let pad = 1;
          let screen = this.$q.screen.name;
          // console.log('got screen', screen, padding);
          if (padding === 'xs') pad = .98;
          else if (padding === 'sm') pad = .95;
          else if (padding === 'md') pad = .92;
          else if (padding === 'lg') pad = .87;
          else if (padding === 'xl') pad = .82;

          // console.log('after switch', padding);
          let windowWidth = window ? window * pad : window.innerWidth * pad;
          let col = cols ? cols : 12;
          let sm = smSize ? smSize : 6;
          let md = mdSize ? mdSize : 4;
          let lg = lgSize ? lgSize : 3;
          let xl = xlSize ? xlSize : 3;
          if (screen === 'xs') {
            // console.log('xs screen', lg, windowWidth);
            return windowWidth / (12 / col);
          } else if (screen === 'sm') {
            // console.log('sm screen', lg, windowWidth);
            return windowWidth / (12 / sm);
          } else if (screen === 'md') {
            // console.log('md screen', lg, windowWidth);
            return windowWidth / (12 / md);
          } else if (screen === 'lg') {
            // console.log('lg screen', lg, windowWidth);
            return windowWidth / (12 / lg);
          } else {
            // console.log('xl screen', lg, windowWidth);
            return windowWidth / (12 / xl);
          }
        },
        $getCurrencyIcon(value) {
          return this.$arrayFilterZero(this.$store.state.currency.national_currencies.filter(a => a.value === value), '', 'icon');
        },
        $getCurrencyName(value) {
          return this.$arrayFilterZero(this.$store.state.currency.national_currencies.filter(a => a.value === value), '', 'name');
        },
        $getCurrencyPrefix(value) {
          return this.$arrayFilterZero(this.$store.state.currency.national_currencies.filter(a => a.value === value), '', 'symbol');
        },
        $ordinalSuffix(i) {
          var j = i % 10,
            k = i % 100;
          if (j === 1 && k !== 11) {
            return i + 'st';
          }
          if (j === 2 && k !== 12) {
            return i + 'nd';
          }
          if (j === 3 && k !== 13) {
            return i + 'rd';
          }
          return i + 'th';
        },
        $last4(number) {
          if (number && number.length) {
            let num = number.substr(number.length - 4); // => "Tabs1"
            let len = number.length - 4;
            let str = '';
            for (let i = 0; i < len; i++) {
              str += '*';
            }
            return str + num;
          } else return false;
        },
        isEmailRule(val) {
          let reg = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/;
          return !reg.test(val);
        },
        getDateFormat(date, format) {
          let useFormat = format ? format : 'ddd, MMM-DD, YYYY h:mm a';
          return formatDate(date, useFormat);
          // console.log('date', date, format)
        },
        $arrayFilterZero(filteredArray, def, prop) {
          if (Array.isArray(filteredArray) && filteredArray.length) {
            return !prop ? filteredArray[0] : filteredArray[0][prop];
          } else return def ? def : null;
        },
        $shareScore(obj) {
          let echos = obj?.echos?.length ? obj.echos.length : 0;
          let hushes = obj?.hushes?.length ? obj.hushes.length : 0;
          return echos - hushes;
        },
        $errNotify(message) {
          this.$q.notify({
            message: message,
            color: 'negative',
            position: 'top',
            icon: 'mdi-alert-circle',
            timeout: 30000,
            actions: [{ icon: 'mdi-close', color: 'white' }],
          });
        },
        $infoNotify(message) {
          this.$q.notify({
            message: message,
            color: 'info',
            position: 'top',
            icon: 'mdi-help-circle',
            timeout: 30000,
            actions: [{ icon: 'mdi-close', color: 'white' }],
          });
        },
        $quickNotify(message) {
          this.$q.notify({
            message: message,
            color: 'primary',
            position: 'top',
            timeout: 5000,
            actions: [{ icon: 'mdi-close', color: 'white' }],
          });
        },
        dollarString(val, test, dec) {
          // console.log('dollar string', val, test)
          let decimal = dec || dec === 0 ? dec : 2;
          let valDec = val.toFixed(decimal);
          return (test ? test : '') + valDec.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        },
        $dollarString(val, test, dec) {
          // console.log('dollar string', val, test)
          let decimal = dec || dec === 0 ? dec : 2;
          let valDec = val.toFixed(decimal);
          return (test ? test : '') + valDec.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
        },
        isIonrev(email) {
          if (email.split('@').length) {
            return email.split('@')[1].toLowerCase() === 'ionrev.com';
          } else return false;
        },
        $computeSkip(skipIn, limitIn) {
          let skip = typeof skipIn === 'number' ? skipIn : 0;
          let limit = typeof limitIn === 'number' ? limitIn : 0;
          return skip * limit;
        },
        $successNotify(message) {
          this.$q.notify({ message: message, color: 'positive', timeout: 4000 });
        },
        makeAvatar(string) {
          return {
            small: { Location: string },
            medium: { Location: string },
            large: { Location: string },
            favicon: { Location: string }
          };
        },
        getSelectItemLabel(opt, dataset, optValue, optLabel) {
          let value = optValue ? optValue : 'value';
          let label = optLabel ? optLabel : 'label';
          let labelVal = dataset[dataset.map(a => a[value]).indexOf(opt)];
          if (labelVal) return labelVal[label];
          else return '';
        },
        ordinalSuffixOf(i) {
          let j = i % 10,
            k = i % 100;
          if (j === 1 && k !== 11) {
            return i + 'st';
          }
          if (j === 2 && k !== 12) {
            return i + 'nd';
          }
          if (j === 3 && k !== 13) {
            return i + 'rd';
          }
          return i + 'th';
        },
        $stringInsertAt(str, character, position) {
          let newStr = String(str).slice(0, position) + character + String(str).slice(position);
          return newStr;
        },
        getAvatar(obj, path, size, idx, defaultImg) {
          // let sz = size ? size : 'small';
          let def = defaultImg ? defaultImg : null;
          let sz = 'large';
          // console.log('getting avatar', obj, path, size)
          if (lget(obj, [path]) && !idx && idx !== 0) {
            if (lget(obj, [path, sz, 'file'], '').length) {
              return lget(obj, [path, sz, 'file']);
            } else return null;
          } else if (obj && !path) {
            if (idx || idx === 0) {
              return lget(obj, [idx, sz, 'file']);
            } else return lget(obj, [sz, 'file']);
          } else if (obj && (idx || idx === 0)) {
            if (lget(obj, [path, idx, sz, 'file'], '').length) {
              return lget(obj, [path, idx, sz, 'file']);
            } else return def;
            // else if(obj && !path) {
            //   console.log('obj no path');
            //   if(idx || idx === 0){
            //     console.log('obj no path and idx');
            //     return lget(obj, [idx, sz, 'file']);
            //   } else return lget(obj, [sz, 'file']);
            // }
          } else return def;
        }
      }
    });
  }
};

