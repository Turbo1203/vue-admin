//自定义全局组件

import Vue from "vue";
import svgIcon from "./svgIcon";

Vue.component('svg-icon' ,svgIcon );

//解析文件，即可使用阿里巴巴icon图标库下载的图标
/**
 * require.context 读取某个目录的所有文件
 * 第一个参数：目录
 * 第二个 : 是否遍历子级目录
 * 第三个 : 定义遍历文件规则
 */
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
    return requireContext.keys().map(requireContext)
}
requireAll(req)