<template>
    <div id="layout" :class="[menuState ? 'close' : 'open']">
        <LayoutHeader />
        <LayoutNav />
        <LayoutMain />
    </div>
</template>
<script>
import { computed } from '@vue/composition-api';
import LayoutHeader from './components/header';
import LayoutNav from './components/nav';
import LayoutMain from './components/main';
export default {
    name : 'layout',
    components : {LayoutHeader,LayoutNav,LayoutMain},
    setup(props,{root}){
        const menuState = computed (() => root.$store.state.app.isCollapse)

        return {
            menuState,
        }
    }
}
</script>
<style lang="scss" scoped>
    #layout {
       
    }
</style>