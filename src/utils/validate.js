// 过滤所有特殊字符
export function stripscript(str) {
    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？↵\r\n]");
    var rs = "";
    for (var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

//验证邮箱
export function validateEmail(value) {
    let reg= /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if(!reg.test(value)) {
        return true;
    }else {
        return false;
    }
}

//验证密码：6-20位的字母+数字的组合
export function validatePasswrd(value) {
    let reg= /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/;
    if(!reg.test(value)) {
        return true;
    }else {
        return false;
    }
}

//验证验证码
export function validateVCode(value) {
    let reg= /^[a-z0-9]{6}$/;
    if(!reg.test(value)) {
        return true;
    }else {
        return false;
    }
}

/**
 * 没有使用defalut 时， 需要{}来引用，可以同时声明多个export
 */