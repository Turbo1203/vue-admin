import Vue from "vue";    // == import Vue from "vue/dist/vue.runtime.common.js";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router/index.js";
import store from "./store/index.js";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./router/permit.js";

//自定义全局方法
//import global from "./utils/global.js";

//引用自定义全局组件
import "./icons";
//Vue.use(global);
Vue.use(ElementUI);
Vue.use(VueCompositionApi);
Vue.config.productionTip = false;


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
