// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const sanitizeHTML = require('sanitize-html');

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    context.data.message = sanitizeHTML(context.data.message, {
      allowedTags: [ 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'abbr', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe', 'img' ],
      disallowedTagsMode: 'discard',
      allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
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
    });
    console.log(context.data.message);
    return context;
  };
};
