// import something here

// "async" is optional
import {colors} from 'quasar';

export default async ({ Vue }) => {
  Vue.mixin({
    data() {
      return {
        windowWidth: window.outerWidth,
        windowHeight: window.outerHeight,
      };
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.windowWidth = window.outerWidth;
      });
      window.addEventListener('resize', () => {
        this.windowHeight = window.outerHeight;
      });
    },
    methods: {
      getCssVar(css_var, element = document.body) {
        if (typeof css_var !== 'string') {
          throw new TypeError('Expected a string as css_var');
        }
        if (!(element instanceof Element)) {
          throw new TypeError('Expected a DOM element');
        }
        let styles = getComputedStyle(element);
        let value = String(styles.getPropertyValue(css_var)).trim();
        if (!value) {
          styles = getComputedStyle(document.documentElement);
          value = String(styles.getPropertyValue(css_var)).trim();
        }
        return value || null;
      },
      setCssVar(css_var, value, element = document.body) {
        if (typeof css_var !== 'string') {
          throw new TypeError('Expected a string as css_var');
        }
        if (typeof value !== 'string') {
          throw new TypeError('Expected a string as value');
        }
        if (!(element instanceof Element)) {
          throw new TypeError('Expected a DOM element');
        }
        let styles = element.style;
        styles.setProperty(css_var, value);
      },
      removeCssVar(css_var, element = document.body) {
        if (typeof css_var !== 'string') {
          throw new TypeError('Expected a string as css_var');
        }
        if (!(element instanceof Element)) {
          throw new TypeError('Expected a DOM element');
        }
        let styles = element.style;
        styles.removeProperty(css_var);
      },
      getTextColor(css_var) {
        let rgba = colors.hexToRgb(this.getCssVar(css_var));

        if ((rgba['r'] * 0.299) + (rgba['g'] * 0.587) + (rgba['b'] * 0.114) > 186) {
          return 'black';
        } else {
          return 'white';
        }
      },
      isCssVarDark(css_var) {
        let rgba = colors.hexToRgb(this.getCssVar(css_var));

        return (rgba['r'] * 0.299) + (rgba['g'] * 0.587) + (rgba['b'] * 0.114) <= 186;
      },
      isHexDark(hex) {
        let rgba = colors.hexToRgb(hex);

        return (rgba['r'] * 0.299) + (rgba['g'] * 0.587) + (rgba['b'] * 0.114) <= 186;
      },
      isLoading(val) {
        if (val) {
          this.$q.loading.show();
        } else {
          this.$q.loading.hide();
        }
      },
      searchExactMatch(item_list, search_query, keys_list) {
        let self = this;
        let lowSearch = search_query.toLowerCase().trim();
        let keys = keys_list;
        if (!lowSearch) return item_list;

        return item_list.filter(function (item) {
          return keys.some(key =>
            String(self.lget(item, key, '')).toLowerCase().includes(lowSearch)
          );
        });
      },
      searchOrMatch(item_list, search_query, keys_list) {
        let self = this;
        if (!search_query) return item_list;

        let low_search_list = search_query.toLowerCase().trim().split(/[ ,]+/);
        let searchRegex = new RegExp(low_search_list.join('|'), 'g');
        let keys = keys_list;

        return item_list.filter(function (item) {
          return keys.some(key =>
            String(self.lget(item, key, '')).toLowerCase().match(searchRegex)
          );
        });
      },
      searchAndMatch(item_list, search_query, keys_list) {
        let self = this;
        if (!search_query) return item_list;

        let low_search_list = search_query.toLowerCase().trim().split(/[ ,]+/);
        let searchRegex = '(?=.*' + low_search_list.join(')(?=.*') + ')';
        let keys = keys_list;

        return item_list.filter(function (item) {
          return keys.some(key =>
            String(self.lget(item, key, '')).toLowerCase().match(searchRegex)
          );
        });
      },
      highlight(words, query) {
        if (!query) return words;
        let low_search_list = query.toLowerCase().trim().split(/[ ,]+/);
        let iQuery = new RegExp(low_search_list.join('|'), 'ig');

        return words.toString().replace(iQuery, function (matchedTxt) {
          return ('<span style=\'background-color: orange;\'>' + matchedTxt + '</span>');
        });
      },
    }
  });
};
