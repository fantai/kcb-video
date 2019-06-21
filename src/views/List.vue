<template>
  <div class="page list-page">
    <div class="search-box">
      <Icon name="search" colorful></Icon>
      <input type="text" placeholder="搜索科创股短视频" v-model="searchInput">
    </div>
    <div v-if="showList.length > 0" class="list-content">
      <header>短视频列表</header>
      <div v-for="item in showList" :key="item.abbrFirstLetter" class="video-item">
        <Video :item="item" v-model="playing"></Video>
        <div class="info">
          <span class="icon">
            <img :src="item | icon">
          </span>
          <div class="content">
            <div class="title">{{item.companyAbbrName}}</div>
            <div class="status">{{item.status}}</div>
          </div>
          <div class="tag">{{item.csrc}}</div>
        </div>
      </div>
      <footer>
        已展示全部短视频
        <div class="support">
          <div class="company nextech">
            <label>短视频内容及制作服务商：</label>
            NexTech（北京创造一下文化传播有限公司）
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
    },
    components: { Icon, Video },
    data() {
      return {
        list: [],
        searchInput: '',
        showCount: 10,
        playing: undefined,
        loading: false,
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
      const scrollElement = document.scrollingElement;
      window.addEventListener('scroll', () => {
        const { list, showCount } = this;
        const { scrollTop, scrollHeight, offsetHeight } = scrollElement;
        if (scrollTop + offsetHeight > scrollHeight - 20) {
          this.showCount = Math.min(list.length, showCount + 10);
        }
      });
    },
    methods: {
      sort(list) {
        // eslint-disable-next-line
        list.forEach(eachData => eachData.statusNo = STATUS.indexOf(eachData.status));
        return list.sort((d1, d2) => d2.statusNo - d1.statusNo);
      },
    },
  };
</script>
<style lang="less">
  .list-page {
    padding: 20px 0;
    .search-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 13px 16px;
      margin: 0 18px;
      border: 1px solid #F2F2F2;
      border-radius: 5px;
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
        outline: none;
        border: 0;
      }
    }
    .video-item {
      padding: 20px 18px;
      box-sizing: border-box;
      border-bottom: 8px solid #F2F2F2;
      video {
        object-fit: fill;
        width: 100%;
        border-radius: 5px;
      }
      .info {
        margin-top: 8px;
        display: flex;
        flex-direction: row;
        align-items: center;
        white-space: nowrap;
        .icon {
          padding: 8px;
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
      header {
        padding: 20px 18px;
        font-size: 15px;
        font-weight: bold;
        border-bottom: 1px solid #F2F2F2;
      }
      footer {
        margin-top: 20px;
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
