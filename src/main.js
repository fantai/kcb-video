import Vue from 'vue';
import App from './App.vue';
import router from './router';
import './registerServiceWorker';

Vue.config.productionTip = false;

Vue.mixin({
  methods: {
    refreshCache(url) {
      // 刷新缓存
      return fetch(url, { headers: { 'cache-control': 'max-age=0' } });
    },
  },
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
