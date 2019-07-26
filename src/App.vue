<template>
  <div id="app" :style="{ overflowY: intro ? 'hidden' : 'visible' }">
    <img class="banner" src="@/assets/banner.jpg" @click="showIntro">
    <div v-show="intro" class="intro" @click="hideIntro">
      <div class="mask"></div>
      <div class="card">
        <header>
          <h2>秒懂科创股</h2>
          <h4>短视频版个股操盘必读</h4>
        </header>
        <div class="content">
          <p>秒懂科创股短视频，由资深黑科技媒体公司<b>NEXTTECH</b>和金融科技公司<b>钒钛智能</b>联合出品。</p>
          <p>个股60秒短视频<b>随每只科创股打新同步上线</b>，助力科创板专业投资者快速把握黑科技公司投资亮点和潜在风险。</p>
          <p>产品面向金融机构<b>按年度打包销售</b>，含所有科创板股票短视频和配套云服务点击流量。</p>
        </div>
        <button>确定</button>
      </div>
    </div>
    <router-view :intro="intro"/>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        intro: false,
      };
    },
    methods: {
      showIntro() {
        this.intro = true;
      },
      hideIntro() {
        this.intro = false;
      },
    },
  };
</script>
<style lang="less">
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    color: #282828;
    background-color: white;
  }
  #app {
    height: 100%;
    overflow-y: visible;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #282828;
    font-size: 13px;
    .banner {
      display: block;
      width: 100%;
    }
    .intro {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 10;
    }
    .mask {
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.3);
    }
    .card {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 30px 20px;
      width: 320px;
      min-height: 400px;
      line-height: 24px;
      box-sizing: border-box;
      border-radius: 12px;
      background-color: white;
      font-size: 14px;
      text-align: center;
      z-index: 1;
      header {
        margin-bottom: 20px;
      }
      .content {
        flex: 1;
      }
      h2, h4 {
        margin: 0;
      }
      h2 {
        font-size: 20px;
      }
      h4 {
        line-height: 2;
        font-size: 15px;
        color: #2358EC;
      }
      p {
        margin: 8px;
        text-align: justify;
      }
      button {
        text-align: center;
        margin: 20px auto 0;
        width: 130px;
        height: 36px;
        border-radius: 50px;
        background-color: #2358EC;
        border: none;
        color: white;
      }
    }
  }
</style>
