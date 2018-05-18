// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Axios from 'axios'
import qs from 'qs'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

// Set config defaults when creating the instance
// const axios_instance = axios.create({
//   baseURL: 'http://127.0.0.1:8000/pyp/',
//   transformRequest: [function (data) {
//     data = qs.stringify(data);
//     return data;
//   }],
//   headers: {'Content-Type': 'application/x-www-form-urlencoded'}
// });
// Vue.prototype.$axios = axios_instance;
Vue.prototype.$axios = Axios;
Axios.defaults.baseURL = 'http://127.0.0.1:8000/pyp/';
Axios.defaults.withCredentials = true;

Vue.use(ElementUI);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // components: {App},
  // template: '<App/>'
  render: h => h(App)
});
