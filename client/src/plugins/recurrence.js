// eslint-disable-next-line no-unused-vars
import { RRule, rrulestr } from 'rrule';
const lget = require('lodash.get');

const recurrenceHandlers = {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options){
    Vue.mixin({
      methods: {
        $nextRecurrence(rule, date, inc){
          let rrule = this.$getRuleObj(rule);
          console.log('recurrence plugin >> rrule', rrule.toString(), rrule.all(function(date, i) {
            console.log('inside', i, date);
            return i < 2;
          }));
          return !inc ? rrule.after(date) : rrule.after(date, inc=true);
        },
        $lastRecurrence(rule, date, inc){
          let rrule = this.$getRuleObj(rule);
          return !inc ? rrule.before(date) : rrule.before(date, inc=true);
        },
        $getRuleObj(rule){
          let byweekday = null;
          if(Array.isArray(lget(rule, 'BYDAY', null))){
            lget(rule, 'BYDAY', []).forEach(day => {
              Array.isArray(byweekday) && byweekday.length ? byweekday.push(RRule[day]) : byweekday = [RRule[day]];
            });
          } else if(rule.BYDAY && typeof rule.BYDAY === 'string') {
            byweekday = RRule[rule.BYDAY];
          }
          let obj = {
            freq: RRule[rule.FREQ],
            count: lget(rule, 'COUNT', null),
            interval: lget(rule, 'INTERVAL', 1),
            bymonth: lget(rule, 'BYMONTH', null),
            byweekno: lget(rule, 'BYWEEKNO', null),
            bymonthday: lget(rule, 'BYMONTHDAY', null),
            byweekday: byweekday,
            byyearday: lget(rule, 'BYYEARDAY', null),
            byminute: lget(rule, 'BYMINUTE', null),
            byhour: lget(rule, 'BYHOUR', null),
            until: lget(rule, 'UNTIL', null),
            wkst: lget(rule, 'WKST', null),
            bysecond: null,
          };
          let kys = Object.keys(obj);
          let ruleObj = {};
          kys.forEach(k => {
            if((obj[k] || obj[k] === 0) && obj[k] !== null && typeof obj[k] !== 'undefined') {
              ruleObj[k] = obj[k];
              console.log('setting obj property', k, obj[k]);
            }
          });
          console.log('ruleobj', ruleObj);
          return new RRule(ruleObj);
        },
        $recurrenceString(rule){
          console.log('get str', rule, rule.FREQ);
          let rrule = this.$getRuleObj(rule);
          console.log('rrule obj', rrule);
          console.log('rrule str', rrule.toString());
          let r = RRule.fromString(rrule.toString());
          console.log('rrule r');
          console.log('rrule', r, rrule.toString(), RRule.YEARLY, RRule.MONTHLY, RRule.WEEKLY, RRule.DAILY, RRule.HOURLY, RRule.MINUTELY);
          return r.toText();
        },
      }
    });
  }
};

export default recurrenceHandlers;
