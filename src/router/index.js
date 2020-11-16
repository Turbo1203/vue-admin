import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

//引入布局组件
import layout from '@/views/layout/index.vue'

export default new Router ({
  routes : [
    // {
    //   path: "/",
    //   name: "Home",
    //   component: () => import("../views/Home.vue")
    // },

    // {
    //   path: "/about",
    //   name: "About",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import( "../views/About.vue")
    // },

    {
      path : "/",
      redirect : "login",
      hidden : true,
      meta : {
        name : "主页"
      }
    },

    {
      path : "/login",
      name : "Login",
      hidden : true,
      meta : {
        name : "登录"
      },
      component : () => import("../views/login/index.vue")
    },

    {
      path : "/console",
      name : "Console",
      redirect : "index",
      meta : {
        name : "控制台",
        icon : 'console',
      },
      component : layout,
      children : [                           //路由跳转后，内容为console/index.vue里面的内容
        {
            path : "/index",
            name : "Index",
            meta : {
              name : "首页"
            },
            component : () => import("../views/console/index.vue")
        }
      ]
    },

    {
      path : "/info",
      name : "Info",
      meta : {
        name : "信息管理",
        icon : 'info',
      },
      component : layout,
      children : [
        {
            path : "/infoIndex",
            name : "InfoIndex",
            meta : {
              name : "信息列表"
            },
            component : () => import("../views/info/index.vue")
        },
        {
          path : "/infoCategory",
          name : "Category",
          meta : {
            name : "信息分类"
          },
          component : () => import("../views/info/category.vue")
      },
      ]
    },

    /**
     * 用户管理
     */
    {
      path : "/user",
      name : "User",
      meta : {
        name : "用户管理",
        icon : 'user',
      },
      component : layout,
      children : [
        {
            path : "/userIndex",
            name : "UserIndex",
            meta : {
              name : "用户列表",
            },
            component : () => import("../views/user/index.vue")
        },
        
      ]
    },

  ]
})