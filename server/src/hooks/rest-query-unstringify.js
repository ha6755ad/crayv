// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    if (context.params.provider === 'rest') {
      for (let key of Object.keys(context.params.query)) {
        try {
          context.params.query[key] = JSON.parse(context.params.query[key]);
        } catch (e) {
          console.log(e);
        }
      }
    }
    return context;
  };
};
