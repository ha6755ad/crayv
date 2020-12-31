<template>
  <div>
  <q-card flat :class="`bg-${borderColor}`" style="height: 100%">
    <div :class="divClass" style="width: 100%; max-width: 100vw">
      <q-card flat class="bg-transparent">
        <q-editor :value="value ? value : ''"
                  @input="inputHandler"
                  ref="editor"
                  width="100%"
                  max-height="100%"
                  :height="height"
                  autofocus
                  :placeholder="placeholder"
                  :toolbar="editor.toolbar"
                  :fonts="editor.fonts"
                  :definitions="editor.definitions"
                  toolbar-rounded
                  toolbar-color="primary"
                  @keyup.enter="trySave()"
                  @keydown.shift="shift = true"
                  @keyup.shift="shift = false"

        />
        <q-btn v-if="!saveOff" round push class="b-r bg-primary text-light" icon="send" @click.stop="trySave(true)"/>
      </q-card>
      <div style="width: 100%;">
        <slot name="notify"></slot>

      </div>
    </div>
  </q-card>
    <ImportVideo @saveURL="saveURL" :dioVideo.sync="dioVideo"></ImportVideo>
  </div>
</template>

<script>
  import ImportVideo from './ImportVideo';

  export default {
    name: 'textEditor',
    components: {
      ImportVideo
    },
    props: {
      borderColor: {
        type: String,
        default: 'light'
      },
      height: {
        type: String,
        default: '100px'
      },
      saveOff: Boolean,
      divClass: {
        type: String,
        default: 'q-pa-sm'
      },
      placeholder: String,
      editor: {
        type: Object,
        required: false,
        default() {
          return {
            toolbar: [
              [
                {
                  label: this.$q.lang.editor.align,
                  icon: this.$q.iconSet.editor.align,
                  fixedLabel: true,
                  list: 'only-icons',
                  options: ['left', 'center', 'right', 'justify']
                },
              ],
              [
                {
                  label: 'Style',
                  list: 'only-icons',
                  fixedLabel: true,
                  options: ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript','removeFormat'],
                }
              ],
              [
                {
                  icon: this.$q.iconSet.uploader.upload,
                  fixedIcon: true,
                  list: 'no-icons',
                  options:  ['insert_img', 'insert_video_url']
                }
              ],
              [
                {
                  label: this.$q.lang.editor.formatting,
                  icon: this.$q.iconSet.editor.formatting,
                  list: 'no-icons',
                  options: [
                    'p',
                    'h1',
                    'h2',
                    'h3',
                    'h4',
                    'h5',
                    'h6',
                    'code'
                  ]
                },
                {
                  label: this.$q.lang.editor.fontSize,
                  icon: this.$q.iconSet.editor.fontSize,
                  fixedLabel: true,
                  fixedIcon: true,
                  list: 'no-icons',
                  options: [
                    'size-1',
                    'size-2',
                    'size-3',
                    'size-4',
                    'size-5',
                    'size-6',
                    'size-7'
                  ]
                },
              ],

              [
                {
                  icon: this.$q.iconSet.editor.unorderedList,
                  list: 'no-icons',
                  options: [
                    'quote',
                    'unordered',
                    'ordered',
                    'outdent',
                    'indent'
                  ]
                },
              ],
            ],
            fonts: {
              arial: 'Arial',
              arial_black: 'Arial Black',
              comic_sans: 'Comic Sans MS',
              courier_new: 'Courier New',
              impact: 'Impact',
              lucida_grande: 'Lucida Grande',
              times_new_roman: 'Times New Roman',
              verdana: 'Verdana'
            },
            definitions: {
              insert_video_url: {
                label: 'Video',
                tip: 'Insert Video',
                icon: 'video_call',
                handler: () => {
                  this.currentEditor = this.$refs.editor;
                  this.dioVideo = !this.dioVideo;
                }
              },
              insert_img: {
                label: 'Image',
                tip: 'Insert Image',
                icon: 'insert_photo',
                handler: () => {
                  // // eslint-disable-next-line no-unused-vars
                  // const post = this.post;
                  // create an input file element to open file dialog
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.png, .jpg'; // file extensions allowed
                  let file;
                  // eslint-disable-next-line no-unused-vars
                  input.onchange = _ => {
                    const files = Array.from(input.files);
                    file = files[0];

                    // lets load the file as dataUrl
                    const reader = new FileReader();
                    let dataUrl = '';
                    reader.onloadend = function () {
                      dataUrl = reader.result;

                      // append result to the body of your post
                      // post.body += '<div><img src="' + dataUrl + '" /></div>';
                      document.execCommand('insertHTML', true, '<div><img src="' + dataUrl + '" style="width: 20%" onclick="document.getElementsByTagName(`body`)[0].style.background = `blue`"/></div>');
                    };
                    reader.readAsDataURL(file);
                  };
                  input.click();
                } // this.insertImg // handler will call insertImg() method
              },
            }
          };
        }
      },
      value: String
    },
    data() {
      return {
        dioVideo: false,
        textInput: '',
        currentEditor: null,
        shift: false
      };
    },
    methods: {
      trySave(pass){
        console.log('trying save', pass, this.shift);
        if(!this.shift || pass) this.$emit('save');
      },
      saveURL(editedItem) {
        this.currentEditor.caret.restore();
        this.currentEditor.runCmd('insertHTML', `<iframe src="${editedItem.url}" class="q-pa-md doc-video" frameborder="0" allowfullscreen="true"></iframe>`);
        this.currentEditor.focus();
        this.currentEditor = null;
      },
      inputHandler(val) {
        this.$emit('update:value', val);
        this.$emit('input', val);
      }
    }
  };
</script>

<style lang="scss">
  .q-editor--default {
    display: flex;
    flex-direction: column-reverse;
  }
//
  .q-editor__toolbars-container {
    border-top: 1px solid rgba(0,0,0,0.12);
}


</style>

<style lang="scss" scoped >

</style>
