<template>
    <div id="nav-wrap">
        <div class="logo"><img src="../../../assets/logo.png"></div>
        <el-menu 
        default-active="1-4-1" 
        class="el-menu-vertical-demo"  
        :collapse="isCollapse" 
        background-color="transparent" 
        text-color="#fff" 
        active-text-color="#fff"
        router>
            <template v-for="(item, index) in routers">
                <el-submenu  v-if="!item.hidden" :key="item.id" :index="index + ''">   <!-- v-for出来的是number类型，所以在index后+空字符串可改成string类型 -->
                 <!-- 一级菜单-->
                  <template slot="title">
                    <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
                    <span slot="title">{{item.meta.name}} </span>
                    </template>
                    <!-- 子级菜单-->
                    <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">{{subItem.meta.name}} </el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
        
    </div>
</template>

<script>
import {ref, reactive, isRef, toRefs, onMounted, computed } from '@vue/composition-api';
export default {
    name : 'navMenu',
    setup(props,{root}) {
        /**
         * data 数据
         */

        //const isCollapse = ref(false);
        const routers = reactive(root.$router.options.routes);
        console.log(routers);

        /* computed监听 */
        const isCollapse = computed(() => {
            return root.$store.state.app.isCollapse;         // return root.$store.state.app.isCollapse;
        });

        return {
            isCollapse,
            routers,
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
    #nav-wrap {
        position : fixed;
        top : 0;
        left : 0;
        width : $navMenu;
        height : 100vh;
        background-color: #344a5f;
        @include webkit(transition, all .3s ease 0s);   // 相当于-webkit-transition : all .3s ease 0s;
        svg {
            font-size : 20px;
            margin-right : 4px;
        }
    }
    .logo {
        //text-align : center; 图片是块元素，不能用text-align居中，要用margin
        img { 
            margin : 28px auto 25px;
            width : 92px;
            @include webkit(transition, all .3s ease 0s);
        }
    }
    .open{
        #nav-wrap { width : $navMenu;}
    }
    .close {
        #nav-wrap { width : $navMenuMin;}
        .logo img { width : 70%;}
    }
</style>