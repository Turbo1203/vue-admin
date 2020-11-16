<template>
    <div id="header-wrap">
        <div class="pull-left header-icon" @click="navMenuState"><svg-icon iconClass="menu" className="menu" /></div>
        <div class="pull-right header-icon">
            <div class="user-info pull-left" >
                <img src="../../../assets/boy.png" width="15%" height="15%"  alt="" />
                {{username}}
            </div>
            <div class="header-icon pull-left" @click="exit">
                <svg-icon iconClass="exit" className="exit"  />
            </div>
        </div>
    </div>
</template>

<script>
import {computed } from "@vue/composition-api"
export default {
    name : 'layoutHeader' ,
    setup(props,{root}) {
        const username = computed(() => root.$store.state.app.username)
        const navMenuState = () => {
            //root.$store.dispatch('setMenuStatus', {"name":"qqq"}); 
            root.$store.commit('app/SET_COLLAPSE'); 
        }
        //退出
        const exit = () => {
            root.$store.dispatch("app/exit").then(() => {
                root.$router.push({
                    name : "Login",
                })
            })
        }
        return {
            navMenuState,
            username,
            exit,
        };
    }
}
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
    #header-wrap {
        position : fixed;
        top : 0;
        right : 0;
        left : $navMenu;
        height : 75px;
        background-color: white;
        line-height : 75px;
        @include webkit(box-shadow , 0 3px 16px 0 rgba(0, 0, 0, .2));   //-webkit-box-shadow : 0 3px 16px 0 rgba(0, 0, 0, .2);
        @include webkit(transition, all .3s ease 0s);   //缓冲动画
    }

    .open {
        #header-wrap { left : $navMenu; }
    };

    .close {
        #header-wrap { left : $navMenuMin; }
    }

    .header-icon {
        padding : 0 32px;
        svg { 
            margin-bottom : -8px;
            font-size : 25px;
            cursor : pointer;
        }
    }
    .user-info {
        height : 100%;
        padding : 0 32px;
        border-right : 1px solid #ededed;
    }
</style>