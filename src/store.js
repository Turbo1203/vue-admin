import Vue from "vue";
import Vuex from "vuex";
//import Cookie from "cookie_js";
import { Login} from "@/api/login.js";

Vue.use(Vuex);

export default new Vuex.Store({
  //导航栏的收起与展开 true展开 false收起
  state: {
    isCollapse : JSON.parse(sessionStorage.getItem('isCollapse')) || false,//isCollapse : JSON.parse(Cookie.get('isCollapse')) || false,   
  },
  getters : {             //相当于computed 进行属性计算
    isCollapse : state => state.isCollapse,
  },
  mutations: {          //同步 没有回调处理事情
    SET_COLLAPSE(state){
      state.isCollapse = !state.isCollapse;
      console.log(state.isCollapse);
      //html5本地存储，sessionStorage，关闭浏览器则清除数据。  而localStorage为长期存储，需要手动清除。*/
      sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse)); //JSON.stringfy(): 转化为字符串string类型
      //Cookie.set('isCollapse',JSON.stringify(state.isCollapse));      //cookie.set('key','value')
    },
  },
  actions: {            //可以回调处理事情
    //异步 请求接口返回数据后，去做别的事
    login(content, requestData) {
      return new Promise((resolve,reject) => {
        //接口
        Login( requestData).then((response) => {
          resolve(response);
        }).catch(error => {
          reject(error);
        })
      })
    }
      //setMenuStatus(content, data) {          //setMenuStatus({commit , state}, data);
      //content.commit('SET_COLLAPSE');     //commit('SET_COLLAPSE');
   },

});
