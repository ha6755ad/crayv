<template>
  <div id="profile-image-picker"
       style="width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center">
    <file-pond name="name"
               ref="pond"
               label-idle='<b>Drag & Drop</b> your image or <b><span class="filepond--label-action"> Browse </span></b> to select'
               accepted-file-types="image/png, image/jpeg, image/gif"
               imagePreviewHeight="170"
               imageCropAspectRatio="1:1"
               imageResizeTargetWidth="600"
               imageResizeTargetHeight="600"
               stylePanelLayout="compact circle"
               styleLoadIndicatorPosition="center bottom"
               styleButtonRemoveItemPosition="left bottom"
               styleProgressIndicatorPosition="right bottom"
               styleButtonProcessItemPosition="right bottom"
               style="width: 170px;"
               :instantUpload="false"
               :imageEditEditor="myDoka"
               v-bind:server="{  process, load, remove }"
               v-bind:files="myFiles"
               @init="handleFilePondInit"
               @processfile="handleFilePondProcessfile"
               @removefile="handleFilePondRemovefile"
               @preparefile="handleFilePondPrepareFile"/> <!-- , revert,  restore, load, fetch -->
    <p :style="titleStyle">{{ title }}</p>

  </div>
</template>

<script>
  const lset = require('lodash.set');
  // AWS SDK
  import AWS from 'aws-sdk';
  // Import Doka
  import {create} from '../../../../css/doka.esm.min';
  import '../../../../css/doka.min.css';

  import vueFilePond from 'vue-filepond';
  // Import FilePond styles
  import 'filepond/dist/filepond.min.css';
  // Import FilePond plugins
  // Please note that you need to install these plugins separately
  // Import image preview plugin styles
  import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
  // Import the plugin styles
  import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';

  // Import image preview and file type validation plugins
  import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
  import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
  import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
  import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
  import FilePondPluginImageResize from 'filepond-plugin-image-resize';
  import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
  import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
  import {mapGetters} from 'vuex';

  // Create component
  const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
  );

  AWS.config.update({
    accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.VUE_APP_AWS_REGION || 'us-west-2',
    sslEnabled: true,
    ServerSideEncryption: 'AES256',
    Tagging: 'Source=Profile'
  });

  export default {
    components: {
      FilePond
    },
    props: {
      name: {
        type: String,
        required: true
      },
      largeImage: {
        type: String,
      },
      instantUpload: {
        type: Boolean,
        required: false,
        default: true
      },
      title: {
        type: String,
        default: 'Upload Image'
      },
      storage: {
        type: String,
        required: false,
        default: 's3'
      },
      titleStyle: {
        type: Object,
        default: function () {
          return {
            fontSize: '11px',
            marginTop: '-5px',
          };
        }
      },
      acceptedFileTypes: {
        type: String,
        default: 'image/png, image/jpeg, image/gif'
      },
      imagePreviewHeight: {
        type: String,
        default: '170'
      },
      imageCropAspectRatio: {
        type: String,
        default: '1:1'
      },
      imageResizeTargetWidth: {
        type: String,
        default: '600'
      },
      imageResizeTargetHeight: {
        type: String,
        default: '600'
      },
      stylePanelLayout: {
        type: String,
        default: 'compact circle'
      },
      styleLoadIndicatorPosition: {
        type: String,
        default: 'center bottom'
      },
      styleButtonRemoveItemPosition: {
        type: String,
        default: 'left bottom'
      },
      styleProgressIndicatorPosition: {
        type: String,
        default: 'right bottom'
      },
      styleButtonProcessItemPosition: {
        type: String,
        default: 'right bottom'
      },
      styleBorder: {
        type: String,
        default: 'width: 170px;'
      },
      imageTransformVariantsIncludeDefault: {
        type: Boolean,
        default: false
      },
      imageTransformVariantsIncludeOriginal: {
        type: Boolean,
        default: true
      },
      imageTransformVariantsOriginalName: {
        type: String,
        default: 'raw'
      }
    },
    data() {
      return {
        // FilePond
        uploadedFiles: [],
        newImage: {},
        myDoka: create({
          cropMask: (root, setInnerHTML) => {
            // https://pqina.nl/doka/docs/patterns/api/doka-instance/#setting-the-crop-mask
            setInnerHTML(root, `
                <mask id="my-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                    <circle cx="50%" cy="50%" r="50%" fill="black"/>
                </mask>
                <rect fill="rgba(255,255,255,.3125)" x="0" y="0" width="100%" height="100%" mask="url(#my-mask)"/>
                <circle cx="50%" cy="50%" r="50%" fill="transparent" stroke-width="1" stroke="#fff"/>
            `);
          },
          // doka options here
          cropAspectRatioOptions: [
            {
              label: 'Free',
              value: null
            },
            {
              label: 'Portrait',
              value: 1.25
            },
            {
              label: 'Square',
              value: 1
            },
            {
              label: 'Landscape',
              value: .75
            }
          ]
        })
      };
    },
    computed: {
      ...mapGetters('file-uploader', {
        findFiles: 'find',
      }),
      myFiles: function () {
        let images = [];
        if (this.largeImage && this.largeImage !== '') {
          images.push({
            source: this.largeImage,
            options: {
              type: 'local'
            }
          });
        }
        return images;
      }
    },
    methods: {
      // ...mapActions('file-uploader', {
      //   uploadFiles: 'create',
      //   removeFiles: 'remove'
      // }),
      // eslint-disable-next-line no-unused-vars
      process(fieldName, file, metadata, load, error, progress, abort) {
        // var s3 = new AWS.S3();
        // var today = new Date();
        // for (var i = 0; i < file.length; i++) {
        //   var stream = file[i];
        //   var uniqueName = {
        //     path: `profile/${today.getFullYear().toString()}${today.getMonth().toString().padStart(2, "0")}/`,
        //     file: `${this.uuidURL()}_${stream.name}_${stream.file.name.replace(/[^a-zA-Z0-9.]/g, "")}`
        //   };
        //   var params = {
        //     Bucket: process.env.VUE_APP_AWS_BUCKET_NAME || 'ionrev-crayv-demo',
        //     Key: uniqueName.path + uniqueName.file,
        //     Body: stream.file,
        //     ContentType: stream.file.type,
        //     ACL: 'public-read'
        //   };
        //   var options = {
        //     partSize: 10 * 1024 * 1024,
        //     queueSize: 1
        //   };
        //   let avatar_key = stream.name;
        //   // eslint-disable-next-line no-console
        //   console.log(this.$store.state.person);
        //   s3.upload(params, options, function (err, data) {
        //     if (err) {
        //       // eslint-disable-next-line no-console
        //       console.log('Something went wrong:', err);
        //     } else {
        //       // eslint-disable-next-line no-console
        //       console.log('Something went right:', data);
        //       if (data['details'] === undefined) {
        //         data['details'] = {};
        //       }
        //       data['details']['name'] = stream.file.name;
        //       data['details']['size'] = stream.file.size;
        //       data['details']['type'] = stream.file.type;
        //       data['details']['lastModifiedDate'] = stream.file.lastModifiedDate;
        //       this.setImage(avatar_key, data)
        //
        //     }
        //   }.bind(this));
        // }
        if(!Array.isArray(file)){
          file = [{file:file, name:'large'}];
        }
        file.forEach(f => {
          let avatar_key = f.name;
          let payload = new FormData();
          payload.append('name', f.file.name);
          payload.append('storage', this.storage);
          payload.append('file', f.file);
          let info = {
            name: f.file.name,
            size: f.file.size,
            type: f.file.type,
            lastModifiedDate: f.file.lastModifiedDate
          };
          payload.append('info', JSON.stringify(info));
          // console.log('payload', payload);
          const axios = this.$axios.create({
            baseURL: process.env.VUE_APP_FEATHERS_URL,
            headers: {
              contentType: 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + this.$store.state.auth.accessToken
            }
          });
          // console.log('posting image', payload);
          axios.post('/file-uploader', payload)
            // this.uploadFiles(payload)
            .then(res => {
              // if (res['info'] === undefined) {
              //   res['info'] = {};
              // }
              // res['info']['name'] = f.file.name;
              // res['info']['size'] = f.file.size;
              // res['info']['type'] = f.file.type;
              // res['info']['lastModifiedDate'] = f.file.lastModifiedDate;
              // console.log('got response in image uploader', res);
              return this.setImage(avatar_key, res.data);
            })
            // eslint-disable-next-line no-unused-vars
            .catch(err => {
              // eslint-disable-next-line no-console
              // console.error('error', err);
            });
        });
      },
      // eslint-disable-next-line no-unused-vars
      load(source, load, error, progress, abort, headers) {
        var myRequest = new Request(source);
        fetch(myRequest)
          .then(function (response) {
            response.blob()
              .then(function (myBlob) {
                load(myBlob);
              })
              // eslint-disable-next-line no-unused-vars
              .catch(function (error) {
                // eslint-disable-next-line no-console
                // console.error('Load Error: ', error);
              });
          });
      },
      // eslint-disable-next-line no-unused-vars
      async remove(uniqueFileId, load, error) {
        // console.log('revert uniqueFileId:', uniqueFileId);
        let imageId = this.lget(this.newImage, 'large._id');
        if (!imageId) {
          let images = this.findFiles({
            query: {
              file: uniqueFileId
            }
          }).data;

          imageId = images[0]._id;
        }
        // eslint-disable-next-line no-unused-vars
        let result = await this.removeFiles(imageId);
        // console.log('removeFiles result:', result);
        this.$emit('input', {});
        load();
      },
      setImage(avatar_key, data) {
        lset(this.newImage, avatar_key, data);
        // console.log('emitting image', this.newImage, this.avatar_key, this.data);
        this.$emit('input', this.newImage);
      },
      // FilePond
      handleFilePondInit: function () {
        // eslint-disable-next-line no-console
        // console.log('FilePond has initialized');
        // FilePond instance methods are available on `this.$refs.pond`
        this.$refs.pond.getFiles();
      },
      // eslint-disable-next-line no-unused-vars
      handleFilePondProcessfile: function (error, file) {
        // eslint-disable-next-line no-console
        // console.log('FilePond succesfully processed file ' + file.filename);
        this.$nextTick();
      },
      handleFilePondRemovefile: function (error, file) {
        // eslint-disable-next-line no-console
        // console.log("FilePond deleted file " + file.filename);
        var index = this.uploadedFiles.indexOf(file.file);
        if (index > -1) {
          this.uploadedFiles.splice(index, 1);
          this.$nextTick();
        }
      },
      // eslint-disable-next-line no-unused-vars
      handleFilePondPrepareFile: function (file, output) {
        // eslint-disable-next-line no-console
        // console.log('FilePond Prepare file ' + file.filename);
        // eslint-disable-next-line no-console
        // console.log('FilePond Prepare file ' + output);
        if(!Array.isArray(output)){
          output = [{file:output, name: 'raw'}];
        }
        output.forEach(file => {
          this.uploadedFiles.push(file);
        });
      }
    }
  };
</script>

<style scoped>

</style>
