const { date } = require('quasar');
const { formatDate, adjustDate } = date;

export const datePlugin = {
  // eslint-disable-next-line no-unused-vars
  methods: {
    genDateHour(h, m) {
      return adjustDate(new Date(), { hours: h, minutes: m ? m : '' });
    },
    getDateFormat(date, format) {
      return formatDate(date, format);
      // console.log('date', date, format)
    }
  }
};

