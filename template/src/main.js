// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router';
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
import '../static/css/theme-blue/index.css';       // 蓝色主题
import "babel-polyfill";
Vue.use(ElementUI);

Vue.config.productionTip = false
import validatorPlugin from "./utils/validator"
Vue.use(validatorPlugin);
import base from './utils/base.js';
Vue.use(base);
import api from './api';
Vue.use(api);
import urls from './api/urls';
Vue.use(urls);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  {{#router}}
  router,
  {{/router}}
  {{#if_eq build "runtime"}}
  render: h => h(App)
  {{/if_eq}}
  {{#if_eq build "standalone"}}
  components: { App },
  template: '<App/>'
  {{/if_eq}}
})
