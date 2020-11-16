import {Login} from "@/api/login.js";
import {setToken, removeToken, setUserName, getUserName, removeUserName} from "@/utils/app.js";

const state = {
  isCollapse : JSON.parse(sessionStorage.getItem('isCollapse')) || false,//isCollapse : JSON.parse(Cookie.get('isCollapse')) || false,
  to_ken : '',
  username : getUserName() || '',
};

const getters = {  //相当于computed 进行属性计算
  isCollapse : state => state.isCollapse,
};

const mutations = {          //同步 没有回调处理事情       在别的页面调用这个方法：root.$store.commit(app/SET_XXXXX)
  SET_COLLAPSE(state){
    state.isCollapse = !state.isCollapse;
    console.log(state.isCollapse);
    /*   //html5本地存储，sessionStorage，关闭浏览器则清除数据。  而localStorage为长期存储，需要手动清除。
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))   //JSON.stringfy(): 转化为字符串string类型 */
    sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse));
    //Cookie.set('isCollapse',JSON.stringify(state.isCollapse));      //cookie.set('key','value')
  },
  SET_TOKEN(state, value){
    state.to_ken = value;
  },
  SET_USERNAME(state, value) {
    state.username = value;
  },
  REMOVE_TOKEN(state){
    state.to_ken = '';
  },
};

const actions = {            //可以回调处理事情      在别的页面调用这个方法：root.$store.dispatch("app/XXXXX")
  //异步 请求接口返回数据后，去做别的事
  login({commit}, requestData) {
    return new Promise((resolve,reject) => {
      //接口
      Login( requestData).then((response) => {
        console.log(response);
        let data = response.data.data;
        // 传统的方式
        // content.commit('SET_TOKEN', data.token);
        // content.commit('SET_USERNAME', data.username);

        //解构的方式
        commit('SET_TOKEN', data.token);
        commit('SET_USERNAME', data.username);
        setToken(data.token);
        setUserName(data.username);
        //token、 username
        resolve(response);
      }).catch(error => {
        reject(error);
      })
    })
  },
  exit( {commit} ){
    return new Promise ((resolve, reject) => {
      removeToken();
      removeUserName();
      commit("SET_TOKEN", '');
      commit("SET_USERNAME", '');
      resolve();      //返回成功的结果 执行root.$store.dispatch().then(() => {  })
    })
    
  }
    //setMenuStatus(content, data) {          //setMenuStatus({commit , state}, data);
    //content.commit('SET_COLLAPSE');     //commit('SET_COLLAPSE');
 };


export default {
  namespaced : true ,
  state,
  getters,
  mutations,
  actions,
}
