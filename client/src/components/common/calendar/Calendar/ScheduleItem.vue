<template>
    <div class="item_container" :style="!expanded ? {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        height: cardHeight + 'px',
        transition: 'height .2s ease'}
        :
        {display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        height: cardSize * 1.24 + cardHeight + 'px',
        transition: 'height .2s'}">
        <div class="internal" :style="{borderTopColor: lineColor}">
            <!--            PRE ICONS-->

            <div class="pre_icon">
                <p :style="{fontSize: topTextSize + 'px', marginBottom: - topTextSize + 'px'}">{{topText}}</p>
                <q-icon v-if="icon"
                        :style="{fontSize: preIconSize, color: 'black', marginBottom: - topTextSize + 'px'}" :name="preIcon"/>
                <p v-else :style="{fontSize: preIconSize, marginBottom: - topTextSize + 'px'}">{{preIcon}}</p>
                <p :style="{fontSize: bottomTextSize  + 'px'}">{{bottomText}}</p>
            </div>

<!--            TIME AND PHOTO-->

            <div :style="{width: avatarSize + 'px'}" class="event_pic">
                <div :style="{backgroundColor: '', position: 'absolute', top: '0px', fontSize: fontScale / 1.4 + 'px', fontColor: timeColor, fontStyle: 'italic', fontWeight: 500}">
                    {{time}}
                </div>
                <img :style="{height: avatarSize + 'px', width: avatarSize + 'px', borderRadius: avatarSize / 5 + 'px'}"
                     :src="avatar">
            </div>

            <!--TITLE AND TEXT-->

            <div :style="{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', fontSize: fontScale + 'px', width: '40%', marginTop: (cardHeight - avatarSize) / 2 + 'px'}">
                <div class="title_font">
                    <p>{{title}}</p>
                </div>
                <div class="sub_title_font">
                    <p>{{subtitle}}</p>
                </div>
                <div class="text_font">
                    <p>{{text}}</p>
                </div>
            </div>
<!--            EXPANSION-->
            <q-space/>

            <!--            SHOP-->
            <div class="action_text" @click="expanded = !expanded" style="cursor: pointer; position: absolute; top: 0; right: 0;">
                   <span class="secondary_font" :style="{color: shopColor}">
                    {{actionText}}&nbsp;
                    </span>
                <q-icon :color="shopColor" small name="fas fa-external-link-alt"/>
            </div>

            <div style="align-self: flex-end; display: flex; position: absolute; right: 0">
<!--                LIST ONE-->
                <div class="action_text">
                    <span class="secondary_font">
                    {{listTitle + ':'}}&nbsp;
                    </span>
                    <div :style="{display: 'flex',  maxWidth: windowWidth / 7 + 'px', overflow: 'hidden'}">
                        <div style="height: 20px; width: 20px; border-radius: 20px; box-shadow: .3px .3px 1px #424242; margin-right: -4px"
                             v-for="(item, index) in listItems" :key="index">
                            <img :src="item.avatars ? item.avatars.small : item.images ? item.images.small : 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/calendar_emoji.png'">
                        </div>
                    </div>
                </div>
<!--                LIST TWO-->
                <div class="action_text">
                    <span class="secondary_font">
                        {{listTwoTitle + ':'}}&nbsp;
                    </span>
                    <div :style="{display: 'flex',  maxWidth: windowWidth / 7 + 'px', overflow: 'hidden'}">
                        <div style="height: 20px; width: 20px; border-radius: 20px; box-shadow: .3px .3px 1px #424242; margin-right: -4px"
                             v-for="(item, index) in listTwoItems" :key="index">
                            <img :src="item.avatars ? item.avatars.small : item.images ? item.images.small : 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/calendar_emoji.png'">
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <q-btn class="expand_btn" v-if="!expanded" @click="expanded = !expanded" round flat icon="mdi-menu-down"/>
        <q-btn round flat class="expand_btn" v-if="expanded" icon="mdi-menu-up" @click="expanded = !expanded"/>
        <div class="__schedule_menu" :style="{width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingTop: '5%',
        display: expanded ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        marginBottom: '1%',
        height: cardSize * 1.24 + 'px',
        transition: '.2s ease'}">
            <p class="secondary_font" style="margin-left: 5%; font-style: italic">Shop food to be delivered at &nbsp;{{time}}</p>
<!--            <single-row :cardSize="cardSize" :num="numCards" :show="expanded"></single-row>-->
        </div>
    </div>
</template>

<script>
  // import SingleRow from '../Vendor/Product/cardGrid/singleRow';

  export default {
    // components: {SingleRow},
    props: {
      cardHeight: {
        type: Number,
        default: 80
      },
      listItems: {
        type: Array,
      },
      listTitle: {
        type: String,
        default: 'Vendors'
      },
      listTwoItems: {
        type: Array,
      },
      listTwoTitle: {
        type: String,
        default: 'Groups'
      },
      timeColor: {
        type: String,
        default: '#263238'
      },
      fontScale: {
        type: Number,
        default: 15
      },
      lineColor: {
        type: String,
        default: '#CFD8DC'
      },
      avatar: {
        type: String,
        default: 'https://ha6755ad-images.s3-us-west-1.amazonaws.com/calendar_emoji.png'
      },
      avatarSize: {
        type: Number,
        default: 60
      },
      time: {
        type: String
      },
      title: {
        type: String
      },
      subtitle: {
        type: String
      },
      text: {
        type: String
      },
      topText: {
        type: String
      },
      topTextSize: {
        type: Number,
        default: 10
      },
      icon: {
        type: Boolean,
        default: true
      },
      preIcon: {
        type: String
      },
      preIconSize: {
        type: String,
        default: '25px'
      },
      preIconClick: {
        type: String,
        default: ''
      },
      preIconColor: {
        type: String,
        default: '#424242'
      },
      bottomText: {
        type: String
      },
      bottomTextSize: {
        type: Number,
        default: 10
      },
      actionText: {
        type: [String, Array],
        default: 'Shop Menu'
      },
      actions: {
        type: [String, Array],
        default: 'fas fa-menu'
      },
      cardSize: {
        type: Number,
        default: 175
      },
      shopColor: {
        type: String,
        default: '#00B0FF'
      }
    },
    data() {
      return {
        windowWidth: null,
        expanded: false
      };
    },
    created() {
      this.getProducts();
    },
    mounted() {
      window.addEventListener('resize', () => {
        this.windowWidth = window.innerWidth;
      });
      this.windowWidth = window.innerWidth;
    },
    computed: {
      numCards() {
        return Math.floor((this.windowWidth * .75) / this.cardSize);
      }
    },
    methods: {

    }
  };

</script>

<style scoped>
    .item_container{
    }
    .internal {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: flex-start;
      border-top-style: solid;
      border-top-width: 1px;
      position: relative;
    }
    .title_font {
        font-weight: 500;
        font-size: 1.2rem;
        margin-left: 3%;
        text-transform: uppercase;
    }
    .pre_icon {
      margin-right: 3%;
      margin-left: 1%;
      display: flex;
      flex-direction: column;
      align-items: center;
      align-self: center
    }
    .event_pic {
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .sub_title_font {
        font-weight: 300;
        font-size: .75rem;
        margin-left: 3%;
        margin-top: -15px;
    }

    .secondary_font {
        font-weight: 400;
        font-size: .9rem;
        display: inline-block;
        vertical-align: middle;
    }
    .__schedule_menu {
    }
    .action_text {
        display: inline-flex;
        margin-right: 10px;
        flex-direction: row;
        align-items: flex-end;
        wrap: no-wrap;
    }
    .expand_btn{
        position: absolute;
        bottom: 0;
        left: 50%;
        margin-bottom: -20px;
        z-index: 5;
        display: none;
    }
    .item_container:hover > .expand_btn{
        display: inline
    }
    .item_container:hover {
        background-color: #ECEFF1;
        transition: background-color .3s ease;
    }


</style>
