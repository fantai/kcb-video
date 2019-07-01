import Vue from 'vue';
import Router from 'vue-router';
import List from './views/List.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: 'kcb-video', // process.env.BASE_URL,
  routes: [
    { path: '*', redirect: '/' },
    { path: '/', redirect: '/list' },
    {
      path: '/list',
      name: 'list',
      component: List,
    },
  ],
});
