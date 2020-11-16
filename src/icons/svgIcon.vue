<template>
     <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg> 
</template>

<script>
import {ref, reactive, isRef, toRefs, onMounted ,computed} from '@vue/composition-api';
export default {
    name : "svgIcon",
    //props: ['iconClass', 'className' ],    //子组件 父组件为nav.vue里的svg-icon,用于接收父组件的数据
    props : {
        iconClass : {
            type : String,                   //定义接收的值的类型
            default : '',                    //默认值， 基础数据类型(如：字符串string,数字number,布尔boolean)：直接赋值。 对象数据类型(如：数组array,函数function)：用函数() => []赋值
            /* require : true,                //必填项，父级必须要传入数据,否则报错
            validator : (value) => {
                return value >=0 ;            //校验 是否>=0
            } */
        },
        className : {
            type : String ,
            default : '' ,
        }
    },
    setup(props ) {

       /*  computed : 监听属性变化 并计算属性 返回结果*/
       const iconName = computed(() => `#icon-${props.iconClass} ` )
       const svgClass = computed(() => {
           if(props.className) {
               return `svg-icon ${props.className}`
           }else {
               return `svg-icon`
           }
       })

    return {
        iconName,
        svgClass,
    };
    }
}
</script>

<style lang="scss" scoped>
.svg-icon {
    width : 1em;
    height : 1em;
    fill : currentColor;
}
</style>