import Vue from 'vue';
import  { date } from 'quasar';
const { getDateDiff, formatDate, adjustDate  } = date;


export default async () => {
  Vue.prototype.genDateHour = (h, m) => {
    return adjustDate(new Date(), { hours: h, minutes: m ? m : '' });
  };

  Vue.prototype.getDateFormat = (date, format) => {
    return formatDate(date, format);
    // console.log('date', date, format)
  };

  Vue.prototype.$buildDate = (config) => {
    console.log('building date', config);
    return date.buildDate(config);
  };

  Vue.prototype.$ago = (date1, format) => {
    let minutes = Math.abs(getDateDiff(new Date(), date1, 'minutes'));
    if (minutes && minutes <= 60) {
      return minutes + ' minutes ago';
    } else {
      let hours = Math.abs(getDateDiff(new Date(), date1, 'hours'));
      if (hours && hours <= 24) {
        return hours + ' hours ago';
      } else {
        let days = Math.abs(getDateDiff(new Date(), date1, 'days'));
        if (days && days < 32) {
          return days + ' days ago';
        } else return formatDate(date1, format ? format : 'ddd MMM-DD, YYYY h:mm a');
      }
    }
  };

  Vue.prototype.$fromNow = (date1, format) => {
    let minutes = Math.abs(getDateDiff(date1, new Date(), 'minutes'));
    if (minutes && minutes < 60) {
      return minutes + ' minutes from now';
    } else {
      let hours = Math.abs(getDateDiff(date1, new Date(), 'hours'));
      if (hours && hours < 24) {
        return hours + ' hours from now';
      } else {
        let days = Math.abs(getDateDiff(date1, new Date(), 'days'));
        if (days && days < 31) {
          return days + ' days from now';
        } else return formatDate(date1, format ? format : 'ddd MMM-DD, YYYY h:mm a');
      }
    }
  };
};
