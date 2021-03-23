import Vue from 'vue';
import mark from '../icons/mark';
import dotWithBorder from '../icons/dotWithBorder';
import locationWithFlag from '../icons/locationWithFlag';
import pin from '../icons/pin';
import flagWithPoleInHole from '../icons/flagWithPoleInHole';
import ballWithPoleInHole from '../icons/ballWithPoleInHole';

// create a constructor from a Vue component
function getIcon(iconComponent) {
  switch (iconComponent) {
    case 'mark':
      return Vue.extend(mark);
    case 'dotWithBorder':
      return Vue.extend(dotWithBorder);
    case 'locationWithFlag':
      return Vue.extend(locationWithFlag);
    case 'pin':
      return Vue.extend(pin);
    case 'flagWithPoleInHole':
      return Vue.extend(flagWithPoleInHole);
    case 'ballWithPoleInHole':
      return Vue.extend(ballWithPoleInHole);
    default:
      return Vue.extend(mark);
  }
}

export const getColoredIconUrl = (locationIcon, fillColor, strokeColor) => {
  // create a Vue element with required props
  const LocationIconConstructor = getIcon(locationIcon);
  const iconComponent = new LocationIconConstructor({ propsData: { fillColor, strokeColor } });
  // mount the component shadow DOM
  iconComponent.$mount();
  // get icon DOM element
  // eslint-disable-next-line no-unused-vars
  const iconDom = iconComponent.$el;
  // generate an html string from an element
  const iconString = new XMLSerializer().serializeToString(iconComponent.$el);
  // finally, generate a data url from a string
  return 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(iconString);
};
