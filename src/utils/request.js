//这个文件是放拦截器
//在login index.vue上点击触发后 跳转到api的login.js那调接口 最后来到 utils request.js处理文件 然后返回到api 再返回到index.vue

import axios from 'axios'
import { Message } from 'element-ui';

//手把手撸码前端API，地址 http://www.web-jshtml.cn/productapi
//创建axios，赋给service
const BASEURL = process.env.NODE_ENV === 'production' ? '' : '/devApi';
const service = axios.create({
    baseURL: BASEURL,    //http://10.207.126.98:8080/devApi/   == vue.config.js里的http://www.web-jshtml.cn/productapi
    timeout: 1000,
});

//添加请求拦截器
service.interceptors.request.use(function(config) {
    //在发送请求前做些什么
    return config;
},function (error) {
    //对请求错误做些什么
    return Promise.reject(error);
});

//添加响应拦截器
service.interceptors.response.use(function (response) {
    //对响应数据做些什么
    let data =response.data
    if(data.resCode !== 0){                //如果邮箱为空，则弹出提示。
        Message.error(data.message);
        return Promise.reject(data);
    }else {
        return response;
    }
},function(error) {
    //对响应错误做些什么
    return Promise.reject(error);
});



export default service;

/**
 * 使用export defalut 时，不需要{}来引用，且不能同时存在多个defalut
 */