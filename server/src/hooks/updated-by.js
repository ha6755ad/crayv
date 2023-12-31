// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = (options = {}) => {
  return async context => {
    // Get authenticated user
    const user = context.params.user;

    //Extract Submitted Data
    const {data} = context;
    let blacklist = ['event-invite', 'layer-join'];
    if (user && !blacklist.includes(context.path) && !(context.path.indexOf('stripe') > -1)) {
      // Add new Fields
      context.data = {
        ...data, // Preserve submitted data
        updatedBy: user._id
      };
    }
    return context;
  };
};
