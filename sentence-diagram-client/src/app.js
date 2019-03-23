import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Home from './pages/Home.vue';
import Register from './pages/Register.vue';

import './assets/css/brands.css';
import './assets/css/fontawesome.css';
import './assets/css/sentence.css';
import './assets/css/solid.css';
import './assets/css/normalize.css';

const router = new VueRouter({
  routes: [{
      path: '/',
      component: Home
    },
    {
      path: '/register',
      component: Register
    }
  ]
});

new Vue({
  router,
  template: `
    <div id="app">
      <router-view></router-view>
    </div>
  `
}).$mount('#app');
