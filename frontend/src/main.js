// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'normalize.css/normalize.css'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App'
import router from './router'
import Axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.prototype.$axios = Axios;
Axios.defaults.baseURL = 'http://127.0.0.1:8000/pyp/';
Axios.defaults.withCredentials = true;

Vue.use(VueI18n);
Vue.config.productionTip = false;

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en',
  messages: {
    'zh': Object.assign(require('./common/lang/zh'), zhLocale),
    'en': Object.assign(require('./common/lang/en'), enLocale)
  }
});

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  // components: {App},
  // template: '<App/>'
  render: h => h(App)
});
