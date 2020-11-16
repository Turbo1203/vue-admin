import router from "./index.js"
import store from "../store/index.js"
import {getToken ,removeToken, removeUserName} from "@/utils/app.js"   //引用function的东西要用{}

const whiteRouter = ['/login'] ;         //白名单 indexOf 方法，判断数组是否存在某个指定的对象，若不存在，返回-1
//路由守卫
router.beforeEach ((to, from, next) => {   //to：下一个页面  from：上一个页面  
    console.log(to)
    if(getToken() ) {
        if(to.path === "/login") {    //进入后台后如果再返回login，则清除token
            removeToken();
            removeUserName();
            store.commit("app/SET_TOKEN", '');
            store.commit("app/SET_USERNAME",'');
            next();
        }else {
            //获取用户角色
            //动态分配路由权限
            next();
        }
        //路由动态添加，分配菜单，为每个角色分配不同的菜单
        console.log("存在");

        /**
         * 1、 to = /console  然后路由重定向redirect到index
         * 2、 to = /inedx    该页面路由没有重定向，所以停留在此页面
         */
    }else {
        console.log("不存在");

        if(whiteRouter.indexOf(to.path) !== -1) {   //存在
            next ();
        }else {                                 //不存在 则跳转回login页面
            next('/login')             //路由指向  next后面跟着执行beforeEach
        }
        /**
         * 1、直接进入index时，参数to被改变成了'/index'，触发路由指向，就会跑beforeEach
         * 2、再一次next指向了login，再次发生路由指向，再跑beforeEach,参数的to改变成了'/login'
         * 3、白名单判断存在，则执行next()，由于()里面没有参数，则不会再跑beforeEach
         */
    }

})