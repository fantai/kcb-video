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
    <div v-else class="no-data">
      <img src="@/assets/no-data.png">
      <span>没有找到相关的科创股短视频<br>换个关键词试试</span>
    </div>
  </div>
</template>
<script>
  import Icon from '@/components/Icon.vue';
  import Video from '@/components/Video.vue';

  const VIDEO_LIST = 'https://video.fantaiai.com/customer/fantai/meta/videos.json';
  const ICON_ADDRESS = 'https://video.fantaiai.com/static/compicons/';

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
          );
        }
        return result.slice(0, showCount);
      },
    },
    created() {
      fetch(VIDEO_LIST)
        .then(res => res.json())
        .then((list) => { this.list = list; })
        .catch(() => undefined)
        .then(() => window.hideLoading());
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
      copyData(list) {
        let result = list;
        for (let i = 0; i < 10; i += 1) {
          result = result.concat(list.map((eachData) => {
            const newObj = { ...eachData };
            // eslint-disable-next-line
            newObj.abbrFirstLetter = newObj.abbrFirstLetter + i;
            return newObj;
          }));
        }
        return result;
      },
    },
  };
</script>
<style lang="less">
  .list-page {
    padding: 20px 18px;
    color: #282828;
    .search-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 13px 16px;
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
      padding: 20px 0 10px;
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
        padding: 20px 0;
        font-size: 15px;
        font-weight: bold;
        border-bottom: 1px solid #F2F2F2;
      }
      footer {
        margin-top: 10px;
        color: #BBBBBB;
        text-align: center;
        font-size: 13px;
      }
      .support {
        margin-top: 20px;
        padding: 14px 0 4px;
        border-top: 1px solid #F2F2F2;
        .company {
          padding: 10px 0 0;
          line-height: 20px;
          font-size: 12px;
          color: #282828;
          label {
            display: block;
            color: #737373;
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
        display: inline-block;
        margin-top: 40px;
        line-height: 28px;
        text-align: center;
        font-size: 15px;
      }
    }
  }
</style>