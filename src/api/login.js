import service from "@/utils/request.js"   

//获取验证码的接口
export function GetSms(data){
    return service.request({
        method:"post",
        url:"/getSms/",
        data 
        //data: data ; 左边的data是变量名(key)后台接收的，右边的是接收的参数，两者相同同名的话，写成一个即可(ES6规则)
    })
}

//获取用户角色

//登录接口
export function Login(data){
    return service.request({
        method : 'post',
        url : '/login/',
        data
    })
}

//注册接口
export function Register(data){
    return service.request({
        method:"post",
        url:"/register/",
        data
    })
}