import Vue from 'vue';
import VueSanitize from 'vue-sanitize';

const defaultOptions = {
  allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img', 'font' ],
  disallowedTagsMode: 'discard',
  allowedAttributes: {
    a: [ 'href', 'name', 'target', 'size' ],
    font: ['size'],
    // We don't currently allow img itself by default, but this
    // would make sense if we did. You could add srcset here,
    // and if you do the URL is checked for safety
    iframe: [ 'src', 'class', 'frameborder', 'allowfullscreen'],
    img: [ 'src', 'style' ]
  },
  // Lots of these won't come up by default because we don't allow them
  selfClosing: [ 'img', 'br', 'hr', 'area', 'base', 'basefont', 'input', 'link', 'meta' ],
  allowIframeHostnames: ['www.youtube.com', 'www.vimeo.com'],
  // URL schemes we permit
  allowedSchemes: [ 'http', 'https', 'ftp', 'mailto', 'data' ],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: [ 'href', 'src', 'cite' ],
  allowProtocolRelative: true,
  enforceHtmlBoundary: false
};

Vue.use(VueSanitize, defaultOptions);

const sanitize = {
  // eslint-disable-next-line no-unused-vars
  install (Vue, options) {
    Vue.mixin({
      methods: {
        sanitize(event) {
          return this.$sanitize(event);
        }
      }
    });
  }
};

export default sanitize;
