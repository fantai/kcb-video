<template>
  <div class="page list-page">
    <div class="search-box-wrapper">
      <div class="search-box" :class="{ fixed: searchBoxFixed }">
        <Icon name="search" colorful></Icon>
        <input type="text" placeholder="搜索科创股短视频" v-model="searchInput">
      </div>
    </div>
    <div v-if="showList.length > 0" class="list-content">
      <header>短视频列表</header>
      <div v-for="item in showList" :key="item.abbrFirstLetter" class="video-item">
        <Video :item="item" v-model="playing"></Video>
        <div class="info">
          <span class="icon" :style="item | icon | iconBgColor">
            <img :src="item | icon">
          </span>
          <div class="content">
            <div class="title">{{item.companyAbbrName}}</div>
            <div class="status">{{item.status}}</div>
          </div>
          <div class="tag">{{item.csrc}}</div>
        </div>
      </div>
      <div class="placeholder"></div>
      <footer>
        已展示全部短视频
        <div class="support">
          <div class="company nextech">
            <label>短视频内容及制作服务商：</label>
            NEXTTECH（北京创造一下文化传播有限公司）
          </div>
          <div class="company fantai">
            <label>数据分析及云计算服务商：</label>
            钒钛智能（上海钒兆钛智能科技有限公司）
          </div>
        </div>
      </footer>
    </div>
    <div v-else-if="!loading" class="no-data">
      <img src="@/assets/no-data.png">
      <span>没有找到相关的科创股短视频<br>换个关键词试试</span>
    </div>
  </div>
</template>
<script>
  import Icon from '@/components/Icon.vue';
  import Video from '@/components/Video.vue';
  import { getImageColor } from '@/utils/imgColorUtil';

  const CUSTOMER = (window.location.href.match(/customer=([^&]+)/) || [])[1] || 'fantai';
  const VIDEO_LIST = `https://video.fantaiai.com/customer/${CUSTOMER}/meta/videos.json`;
  const ICON_ADDRESS = 'https://video.fantaiai.com/static/compicons/';
  const STATUS = [
    '-', '终止', '中止', '已受理', '已问询', '上市委会议', '上市委会议未通过', '有条件通过', '上市委会议通过',
    '复审委会议', '复审委会议未通过', '复审委会议通过', '提交注册', '注册结果', '不予注册', '注册生效', '已发行',
  ];

  export default {
    filters: {
      icon(item) {
        return `${ICON_ADDRESS + item.companyAbbrName}.png`;
      },
      // eslint-disable-next-line no-unused-vars
      iconBgColor(imgPath) {
        return {
          backgroundColor: getImageColor(imgPath),
        };
      },
    },
    components: { Icon, Video },
    props: {
      intro: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        list: [],
        searchInput: '',
        showCount: 10,
        playing: undefined,
        loading: false,
        searchBoxFixed: false,
      };
    },
    computed: {
      showList() {
        const { list, searchInput, showCount } = this;
        let result = list;
        if (searchInput && searchInput.trim() !== '') {
          result = list.filter(
            eachItem => eachItem.companyAbbrName.indexOf(searchInput) >= 0
              || eachItem.abbrFirstLetter.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0,
          ).sort();
        }
        return result.slice(0, showCount);
      },
    },
    watch: {
      loading() {
        if (this.loading) {
          window.showLoading();
        } else {
          window.hideLoading();
        }
      },
      showList() {
        this.playing = undefined;
      },
      intro() {
        if (this.intro) {
          this.playing = undefined;
        }
      },
    },
    created() {
      this.loading = true;
      fetch(VIDEO_LIST)
        .then(res => res.json())
        .then((list) => { this.list = this.sort(list); })
        .catch(() => undefined)
        .then(() => { this.loading = false; });

      // 刷新缓存，保证下次打开能得到新内容
      this.refreshCache(VIDEO_LIST);
    },
    mounted() {
      const searchBox = this.$el.querySelector('.search-box-wrapper');
      const scrollElement = document.scrollingElement;
      window.addEventListener('scroll', () => {
        const { list, showCount } = this;
        const { scrollTop, scrollHeight, offsetHeight } = scrollElement;
        if (scrollTop + offsetHeight > scrollHeight - 20) {
          this.showCount = Math.min(list.length, showCount + 10);
        }

        // 计算search-box位置，判断是否浮动显示
        const { top } = searchBox.getBoundingClientRect();
        this.searchBoxFixed = top < 0;
      });
    },
    methods: {
      sort(list) {
        // eslint-disable-next-line
        list.forEach(eachData => eachData.statusNo = STATUS.indexOf(eachData.status));
        return list.sort(
          (d1, d2) => (d2.statusNo - d1.statusNo) || (d2.dataUpdateDate - d1.dataUpdateDate),
        );
      },
    },
  };
</script>
<style lang="less">
  .list-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: visible;
    padding-top: 20px;
    box-sizing: border-box;
    .search-box-wrapper {
      height: 42px;
    }
    .search-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 12px 16px;
      margin: 0 18px;
      border: 1px solid #F2F2F2;
      border-radius: 5px;
      &.fixed {
        position: fixed;
        top: -1px;
        left: 18px;
        right: 18px;
        margin: 0;
        background-color: white;
        border-radius: 0;
        border-color: white;
        z-index: 5;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          bottom: 0;
          left: -18px;
          right: -18px;
          background-color: white;
          box-shadow: 0 0 2px 1px #F2F2F2;
          z-index: -1;
        }
      }
      * {
        vertical-align: middle;
      }
      svg {
        line-height: 1ex;
        font-size: 16px;
        margin-right: 10px;
      }
      input {
        flex: 1;
        padding: 0;
        margin: 0;
        line-height: 16px;
        outline: none;
        border: 0;
        font-size: 13px;
      }
    }
    .video-item {
      padding: 20px 18px;
      box-sizing: border-box;
      border-bottom: 8px solid #F2F2F2;
      .info {
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        white-space: nowrap;
        .icon {
          padding: 6px;
          width: 48px;
          min-width: 48px;
          height: 48px;
          border: 1px solid #F2F2F2;
          border-radius: 50%;
          margin-right: 8px;
          box-sizing: border-box;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .content {
          flex: 1;
          margin-right: 20px;
        }
        .title {
          line-height: 28px;
          font-size: 17px;
          font-weight: bold;
        }
        .status {
          line-height: 20px;
          font-size: 13px;
          font-weight: 500;
        }
        .tag {
          padding: 0 6px;
          line-height: 20px;
          background: #F2F2F2;
          border-radius: 3px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .list-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      header {
        padding: 20px 18px;
        font-size: 15px;
        font-weight: bold;
        border-bottom: 1px solid #F2F2F2;
      }
      .placeholder {
        flex: 1;
      }
      footer {
        padding: 20px 0;
        color: #BBBBBB;
        text-align: center;
        font-size: 13px;
      }
      .support {
        margin-top: 20px;
        padding: 14px 0 0;
        border-top: 1px solid #F2F2F2;
        .company {
          padding: 6px 0 0;
          line-height: 18px;
          font-size: 12px;
          color: #737373;
          label {
            display: block;
            color: #BBBBBB;
          }
        }
      }
    }
    .no-data {
      padding: 120px 0 0;
      text-align: center;
      img {
        margin: auto;
        width: 50%;
      }
      span {
        display: block;
        margin-top: 40px;
        line-height: 28px;
        text-align: center;
        font-size: 15px;
      }
    }
  }
</style>
