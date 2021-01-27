const lget = require('lodash.get');
const lset = require('lodash.set');
const lisequal = require('lodash.isequal');
const lisEmpty = require('lodash.isempty');

const validators = {
  notEmpty: {
    method: (field, type, format) => {
      let fieldCheck = field && (field.value || field.value === 0) && typeof field.value !== 'undefined';
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? format(field) : true;
      return fieldCheck && typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return `${field.name} cannot be empty. ${error ? error: ''}`;
    }
  },
  type: {
    method: (field, type, format) => {
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? format(field) : true;
      return typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return `${field.name} must be type ${type}. ${error ? error: ''}`;
    }
  },
  format: {
    method: (field, type, format) => {
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? format(field) : true;
      return typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return `${field.name} error - ${error ? error: ''}`;
    }
  },
  sameAs: {
    method: (field, type, format) => {
      let typeCheck = type ? typeof field.value === type : true;
      let formatCheck = format ? field.value === format : true;
      return typeCheck && formatCheck;
    },
    err: (field, type, error) => {
      return `${field.name} error - ${error ? error: ''}`;
    }
  },
  arrayLength: {
    method: (field, number) => {
      return Array.isArray(field.value) && field.value.length >= parseFloat(number);
    },
    err: (field, number, error) => {
      return `${field.name} requires at least ${number} selection${number === '1' ? '' : 's'}. ${error ? error: ''}`;
    }
  },
  gt: {
    method: (field, number) => {
      if (typeof field.value === 'number') return field.value > parseFloat(number);
      else if (['array', 'string'].includes(typeof field.value)) {
        let length = lget(field, 'value', []).length;
        return length > parseFloat(number);
      }
    },
    err: (field, number, error) => {
      return `${field.name} ${typeof field.value === 'number' ? '' : 'length'} must be greater than ${number}. ${error ? error: ''}`;
    }
  },
  lt: {
    method: (field, number) => {
      if (typeof field.value === 'number') return field.value < parseFloat(number);
      else if (['array', 'string'].includes(typeof field.value)) {
        let length = lget(field, 'value', []).length;
        return length < parseFloat(number);
      }
    },
    err: (field, number, error) => {
      return `${field.name} ${typeof field.value === 'number' ? '' : 'length'} cannot exceed ${number}. ${error ? error: ''}`;
    }
  },
};

export const vCheck = {
  // eslint-disable-next-line no-unused-vars
  data() {
    return {
      //must set these properties in local component - issues exporting them here
      vErrors: {},
      vDirty: {},
      isVDirty: false
    };
  },
  watch: {
    validForm: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal){
        // console.log('see changes', newVal, oldVal);
        if(this.updateValidOnInput) {
          this.$vRefreshErrors(newVal, oldVal);
        }
      }
    },
  },
  computed: {
    validForm(){
      return this.vCheckForm ? Object.assign({}, this.vCheckForm) : {};
    },
    $vErrorList() {
      let errorList = [];
      let list = this.vErrors ? Object.keys(this.vErrors) : [];
      let errors = this.vErrors;

      const pushErr = key => {
        if(lget(errors, key)) {
          if (lget(errors, key) && typeof lget(errors, key) === 'object') {
            Object.keys(lget(errors, key)).forEach(k => {
              pushErr(`${key}.${k}`);
            });
          } else errorList.push(lget(errors, key));
        }
      };

      list.forEach(key => {
        if(errors[key]) {
          pushErr(key);
        }
      });
      return errorList;
    }
  },
  methods: {
    $flatObjKeyList(obj, path){
      let list = [];
      if (!lisEmpty(obj)) {
        Object.keys(obj).forEach(key => {
          let newPath = path ? `${path}.${key}` : key;
          let getVal = lget(obj, key, '');
          // console.log('see change');
          let pathToAdd = typeof getVal === 'object' && !Array.isArray(getVal) ? this.$flatObjKeyList(getVal, newPath) : newPath;
          list.push(pathToAdd);
        });
      }
      return this.$flattenArray(list);
    },
    $getSaveObj(vCheck){
      let obj = {};
      let form = vCheck ? vCheck : this.vCheckForm;
      if(form){
        let list = this.$flatObjKeyList(form);
        list.forEach(key => {
          if(lget(this.isDirty, key)) {
            lset(obj, key, lget(form, key));
          }
        });
      }
      return obj;
    },
    $vRefreshErrors(newVal, oldVal){
      // console.log('refresh errors', newVal, oldVal);
      let equal = lisequal(newVal, oldVal);
      if (oldVal && !equal && newVal) {
        this.isVDirty = true;
        const layerDeep = (val, oVal, path) => {
          // console.log('layerdeep', val, oVal, path);
          Object.keys(val).forEach(key => {
            let newPath = path ? `${path}.${key}` : key;
            let getVal = lget(val, key, '');
            if (!lisequal(getVal, lget(oldVal, 'key'))) {
              // console.log('see change');
              if (getVal && typeof getVal === 'object' && !Array.isArray(getVal)) {
                layerDeep(getVal, lget(oVal, key), newPath);
              } else {
                lset(this.vDirty, newPath, true);
                // console.log('set dirty', this.vDirty);
              }
            }
          });
        };
        layerDeep(newVal, oldVal);
        let errs = this.$vCheck(newVal);
        console.log('errs', errs);
      }
    },
    $vErrorCheck(prop){
      let dirty = this.vDirty ? Object.assign({}, this.vDirty) : {};
      if(lget(dirty, prop)){
        return lget(this.vErrors, prop, false) ? true : false;
      } else return false;
    },
    $vErrorMessage(prop){
      let dirty = this.vDirty ? Object.assign({}, this.vDirty) : {};
      if(lget(dirty, prop)){
        return lget(this.vErrors, prop, '');
      } else return '';
    },
    $vRuleCheck(prop){
      let dirty = this.vDirty ? Object.assign({}, this.vDirty) : {};
      if(lget(dirty, prop)){
        let err = lget(this.vErrors, prop, false);
        return err ? [err] : true;
      } else return true;
    },
    $vGetErrorList(errors) {
      let errorList = [];
      let list = errors ? Object.keys(errors) : [];

      const pushErr = key => {
        if(lget(errors, key)) {
          if (lget(errors, key) && typeof lget(errors, key) === 'object') {
            Object.keys(lget(errors, key)).forEach(k => {
              pushErr(`${key}.${k}`);
            });
          } else errorList.push(lget(errors, key));
        }
      };

      list.forEach(key => {
        if(errors[key]) {
          pushErr(key);
        }
      });
      return errorList;
    },
    $vErrNotify(err) {
      this.$q.notify({
        message: err,
        position: 'bottom',
        color: 'negative',
        timeout: 10000,
        actions: [{ icon: 'mdi-close', color: 'white' }],
        icon: 'mdi-information'
      });
    },

    //validCheck is an object and v can either ben an array like v: ['notEmpty', 'type:string'] or an object like
    // v: {
    // check: 'notEmpty',
    // arg: 'string',
    // format: <some regex or other check function>
    // error: 'Error message'
    // }
    $vCheck(form, validCheck) {
      //You can pass in a custom validCheck such as in needing to use this for two objects in one component
      let valid = validCheck ? validCheck : this.validCheck;
      // console.log('vCheck', form, valid);

      let errors = {};
      let key_list = Object.keys(valid);

      key_list.forEach(key => {
        let keyProp = valid[key];
        let methods = lget(keyProp, 'v');
        if (Array.isArray(methods)) {
          methods.forEach(method => {
            console.log('checking method', key, form, keyProp);
            let fieldObj = { value: lget(form, key), name: lget(keyProp, 'name', key)};
            let v = method.split(':');
            console.log('v', v, methods, method);
            let prop = v[0];
            let arg = v[1];
            console.log('prop', prop, validators[prop]);
            let validator = lget(validators, prop);
            let check = validator ? validator['method'](fieldObj, arg) : null;
            console.log('check', check, fieldObj, arg);
            if (!check) lset(errors, key, validator['err'](fieldObj, arg));
            else {
              console.log('check success - removing error for ', key);
              lset(errors, key,  null);
            }
          });
        } else {

          let fieldObj = { value: lget(form, key), name: lget(keyProp, 'name', key) };
          console.log('got field obj', fieldObj, key, form);

          let prop = lget(methods, 'check');
          let arg = lget(methods, 'arg');

          //For format functions remember that the field value is at .value

          let format = lget(methods, 'format');
          let error = lget(methods, 'error');
          console.log('prop', methods, key, prop, validators[prop]);
          let validator = lget(validators, prop);

          let check = validator ? validator['method'](fieldObj, arg, format) : true;
          // console.log('not array', 'key', key, 'prop', prop, 'arg', arg, 'format', format, 'error', error, 'check', check);
          if (!check){
            console.log('ggot err', validators[prop].err(fieldObj, arg, error), fieldObj, arg);
            lset(errors, key, validator['err'](fieldObj, arg, error));
          } else {
            console.log('check success - removing error for ', key);
            lset(errors, key,  null);
          }
        }
      });
      // console.log('set errors', errors);
      this.vErrors = this.vErrors ? {...this.vErrors, ...errors} : Object.assign({}, errors);
      return this.$vGetErrorList(errors);
    }
  }
};
