import ShopIcon from 'components/common/atoms/custom-icons/ShopIcon';
import EventIcon from 'components/common/atoms/custom-icons/EventIcon';
import ClassifiedIcon from 'components/common/atoms/custom-icons/ClassifiedIcon';
import WalletIcon from 'components/common/atoms/custom-icons/WalletIcon';
import CartIcon from 'components/common/atoms/custom-icons/CartIcon';
import HistoryIcon from 'components/common/atoms/custom-icons/HistoryIcon';
import ClassifiedsDrawer from 'components/marketplace/drawers/ClassifiedsDrawer';
import CrowdShopDrawer from 'components/marketplace/drawers/CrowdShopDrawer';

export const MarketPlaceDrawer = {
  computed: {
    activeItem(){
      return this.$arrayFilterZero(this.navItems.filter(a => a.active));
    },
    navItems() {
      return [
        {
          label: 'Products',
          caption: 'Community e-commerce',
          iconComponent: ShopIcon,
          active: this.$route.name === 'product-store',
          click: () => {
            this.$router.push({name: 'product-store', query: this.$route.query, params: this.$route.params });
          }
        },
        {
          label: 'Crowd Store',
          caption: 'Buy in groups for big savings',
          iconComponent: EventIcon,
          drawer: CrowdShopDrawer,
          active: this.$route.path.indexOf('/crowd-store') > -1,
          click: () => {
            this.$routerPreserve({name: 'crowd-store'});
          }
        },
        {
          label: 'Classifieds',
          caption: 'Peer to peer stuff exchange',
          iconComponent: ClassifiedIcon,
          drawer: ClassifiedsDrawer,
          drawerAttrs: {},
          active: this.$route.path.indexOf('/classifieds') > -1,
          click: () => {
            this.$router.push({name: 'classifieds', query: this.$route.query, params: this.$route.params });
          }
        },
        {
          label: 'Crayv Wallet',
          caption: 'See your balance and activity',
          iconComponent: WalletIcon,
          active: this.$route.name === 'wallet',
          click: () => {
            this.$router.push({name: 'wallet', query: this.$route.query, params: this.$route.params });
          }
        },
        {
          label: 'Cart',
          caption: 'Your shopping cart',
          iconComponent: CartIcon,
          active: this.$route.name === 'cart',
          click: () => {
            this.$router.push({name: 'cart', query: this.$route.query, params: this.$route.params });
          }
        },
        {
          label: 'Order History',
          caption: 'View historical orders',
          iconComponent: HistoryIcon,
          active: this.$route.name === 'orders',
          click: () => {
            this.$router.push({name: 'orders', query: this.$route.query, params: this.$route.params });
          }
        }
      ];
    }
  }
};
