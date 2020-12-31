const lget = require('lodash.get');
const lset = require('lodash.set');

const validators = {
  notEmpty: {
    method: (field, type, format) => {
      let fieldCheck = field && field.value && typeof field.value !== 'undefined';
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
      vDirty: {}
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
      list.forEach(key => {
        if(this.vErrors[key]) {
          errorList.push(this.vErrors[key]);
        }
      });
      return errorList;
    }
  },
  methods: {
    $vRefreshErrors(newVal, oldVal){
      // console.log('refresh errors', newVal, oldVal);
      if (newVal && Object.keys(newVal)) {
        this.$vCheck(newVal);

        const layerDeep = (val, oVal, path) => {
          // console.log('layerdeep', val, oVal, path);
          Object.keys(val).forEach(key => {
            let newPath = path ? path + key : key;
            let getVal = lget(val, key, '');
            if (JSON.stringify(getVal) !== JSON.stringify(lget(oVal, key, ''))) {
              // console.log('see change');
              if (getVal && typeof getVal === 'object' && !Array.isArray(getVal)) {
                console.log('another layer', key);
                layerDeep(getVal, lget(oVal, key), newPath);
              } else {
                // console.log('return dirty', newPath);
                lset(this.vDirty, newPath, true);
                // console.log('set dirty', this.vDirty);
              }
            }
          });
        };

        layerDeep(newVal, oldVal);

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
        return err ? [err] : [];
      } else return [];
    },
    $vGetErrorList(errors) {
      let errorList = [];
      let list = errors ? Object.keys(errors) : [];
      list.forEach(key => {
        if(errors[key]) {
          errorList.push(errors[key]);
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
        let methods = valid[key].v;
        if (Array.isArray(methods)) {
          methods.forEach(method => {
            let fieldObj = { value: form[key], name: valid[key].name ? valid[key].name : key };
            let v = method.split(':');
            let prop = v[0];
            let arg = v[1];
            let check = validators[prop].method(fieldObj, arg);
            if (!check) errors[key] = validators[prop].err(fieldObj, arg);
          });
        } else {
          let fieldObj = { value: form[key], name: valid[key].name ? valid[key].name : key };
          let prop = lget(valid, [key, 'v', 'check']);
          let arg = lget(valid, [key, 'v', 'arg']);

          //For format functions remember that the field value is at .value

          let format = lget(valid, [key, 'v', 'format']);
          let error = lget(valid, [key, 'v', 'error']);
          let check = validators[prop].method(fieldObj, arg, format);
          // console.log('not array', 'key', key, 'prop', prop, 'arg', arg, 'format', format, 'error', error, 'check', check);
          if (!check){
            // console.log('ggot err', validators[prop].err(fieldObj, arg, error));
            errors[key] = validators[prop].err(fieldObj, arg, error);
          } else {
            // console.log('check success - removing error for ', key);
            errors[key] = null;
          }
        }
      });
      // console.log('set errors', errors);
      this.vErrors = this.vErrors ? {...this.vErrors, ...errors} : Object.assign({}, errors);
      return this.$vGetErrorList(errors);
    }
  }
};
