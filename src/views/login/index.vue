<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li  v-for="item in menuTab" :key="item.id" :class="{'current':item.current}" @click="toggleMenu(item)">{{item.txt}}</li>
      </ul>

      <!--表单-->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm"  class="login-form" size="medium ">
        
        <el-form-item  prop="username" class="item-form">
          <label for="username">邮箱</label>
          <el-input type="text" id="username" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item  prop="password" class="item-form">
          <label>密码</label>
          <el-input type="password" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item  prop="passwords" class="item-form" v-show="model === 'register'">
          <label>确认密码</label>
          <el-input type="password" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
        </el-form-item>

        <el-form-item  prop="code" class="item-form">
          <label>验证码</label>
          <el-row :gutter="11">
            <el-col :span="16"><el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input></el-col>
            <el-col :span="8"><el-button type="success" class="block" @click="getSms()" :disabled ="codeButtonStatus.status">{{ codeButtonStatus.text }}</el-button></el-col>
          </el-row>
          
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block" :disabled ="loginButtonStatus">{{model === 'login' ? "登录" : "注册"}}</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
// import service from "@/utils/request.js"   ,   import后面的service没用{}是因为 request.js文件中的service是默认defalut的
import sha1 from 'js-sha1';
import { Message } from 'element-ui';
import { GetSms,Register,Login} from "@/api/login.js";
import { reactive,ref, isRef, toRefs, onMounted} from '@vue/composition-api';
import {stripscript,validateEmail,validatePasswrd,validateVCode } from '@/utils/validate.js';   //validate.js中没有defalut，所以用{}来引用多个
export default {
    name:'login',
    
    //setup(props,context)
    setup(props, {refs ,root }){

      //验证用户名为邮箱
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(validateEmail(value)){
            callback(new Error('用户名格式有误'));
         } else{
          callback();
        }
      };

      //验证密码
      let validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validatePasswrd(value)) {
          callback(new Error('密码为6-20位的数字与字母的组合'));
        } else {
          callback();
        }
      };
      
      //验证确认密码
      let validatePasswords = (rule, value, callback) => {
        //如果模块值model为login,则直接通过
        if(model.value === 'login') {
          callback();
        }
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != ruleForm.password) {
          callback(new Error('两次密码不一致'));
        } else {
          callback();
        }
      };

      //验证验证码
      let validateCode = (rule, value, callback) => {
        if (value ==='') {
          return callback(new Error('请输入验证码'));
        }else if(validateVCode(value)) {
          return callback(new Error('验证码格式有误'));
        }else{
          callback();
        }
      };
      //放置data数据，生命周期，自定义函数
      const menuTab =reactive([
          { txt:'登录',current: true, type: 'login'},
          { txt:'注册',current: false, type: 'register'}
        ]);

      //模块值
        const model= ref('login')

      //登录按钮禁用状态
      const loginButtonStatus = ref(true);

      //验证码按钮状态
      const codeButtonStatus = reactive(
        {
          status: false,
          text: "获取验证码"
        }
      )
      //倒计时 声明变量
      const timer = ref(null);

      //表单的数据
      const ruleForm = reactive ({
          username: '',
          password: '',
          passwords: '',
          code: ''
        });

      //表单的验证
      const rules =reactive ({
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwords: [
            { validator: validatePasswords, trigger: 'blur' }
          ],
          code: [
            { validator: validateCode, trigger: 'blur' }
          ]
        });
      
    

      //声明函数
      const toggleMenu =(data => {
        menuTab.forEach((elem,index) => {
          elem.current=false
        });

        //高光
        data.current = true

        //修改模块值
        model.value = data.type

        resetFormData();
        clearCountDown();
      });

      //清除表单数据
      const resetFormData = (() => {
        //重置表单
        refs.loginForm.resetFields();
      })

      //更新按钮的状态
      const updateButtonStatus= ((params) => {
        codeButtonStatus.status = params.status ;
        codeButtonStatus.text = params.text ;
      })

      //获取验证码
      const getSms =(() => {
        //进行提示
        if(ruleForm.username === ""){
          root.$message.error('邮箱不能为空！！');
          return false
        }
        if(validateEmail(ruleForm.username)) {
          root.$message.error('邮箱格式有误，请重新输入！！');
          return false
        }

        //请求的接口 获取验证码
        let requestData ={
          username: ruleForm.username,
          module: model.value
        }

        //修改获取验证码按钮状态
        updateButtonStatus({
          status : true ,
          text : "发送中" 
        })

        //延时多长时间
        setTimeout(() => {
          GetSms(requestData).then(response =>{   //接收拦截器中response的信息
          let data = response.data
          root.$message({
            message : data.message,
            type : 'success'
          })

          //启用登录或注册按钮
          loginButtonStatus.value = false

          //调用定时器,倒计时
          countDown(5)

          console.log(data)
          }).catch(error =>{                                          //接收拦截器中reject(error)的信息
            console.log(error)
          })
        },2000)
      });
      //提交表单
      const submitForm = (formName => {

        refs[formName].validate((valid) => {    // ==refs.loginForm.validate();

        //表单验证通过
          if (valid) {
            if(model.value === 'login'){
              login()
            }else {
              register()
            }         
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      });
      //登录
      const login = (() => {
        let requestData = {
          username : ruleForm.username,
          password : sha1(ruleForm.password),
          code : ruleForm.code
        }
        root.$store.dispatch('app/login',requestData).then(response => {
          console.log("登录成功！！！！！");
          console.log(response);
          root.$router.push({   //登录成功后 页面跳转
            name : "Console",
          }).catch(error => {});

        })
      });

      //注册
      const register = (() =>{
        let requestData = {
          username : ruleForm.username,
          password : sha1(ruleForm.password),
          code : ruleForm.code,
          module : 'register'
          }
        //注册接口
        Register(requestData).then(response =>{    //调用Register这个方法，then：成功之后做什么事
          let data = response.data
          root.$message ({
            message : data.message,
            type : 'success'
          })
          //模拟注册成功
          toggleMenu(menuTab[0])
          clearCountDown()
        }).catch(error =>{                   //失败之后做什么事
          //失败执行的代码
        })                 
      });

      //倒计时 方法
      const countDown = ((number) =>{

        //判断定时器是否存在,存在则清除
        if(timer.value) { clearInterval(timer.value)}

        //方法一 ：setTimeout : clearTimeout(变量) 只执行一次
        //方法二： setInterval : clearInterval(变量) 不断执行，需要条件才会停止

        let time = number

        timer.value = setInterval(() =>{
          time--
          if(time === 0){
            clearInterval(timer.value)
            updateButtonStatus({
              status : false ,
              text : "再次获取" 
            })
          }else{
            codeButtonStatus.text = `倒计时${time}秒`
          }

        },1000)
      });

      //清除倒计时
      const clearCountDown = (() => {
        //还原验证码按钮默认状态
        updateButtonStatus({
          status : false ,
          text : "获取验证码" 
        })
        
        //清除倒计时
        clearInterval(timer.value)
      });

      //生命周期 

      //挂载完成后执行：
      onMounted(() => {
        GetSms()
      })
      return {
        menuTab,
        model,
        loginButtonStatus,
        codeButtonStatus,
        ruleForm,
        rules,
        toggleMenu,
        submitForm,
        getSms,
      }
    },

}
</script>

<style lang="scss" scoped>
#login{
  height:100vh;
  background-color: #344a5f;
}
.login-wrap{
  width:330px;
  margin: auto;
}
.menu-tab{
  text-align: center;
  li{
    display: inline-block;
    width:88px;
    line-height: 36px;
    font-size: 14px;
    color: white;
    border-radius: 2px;
    cursor: pointer;
  }
  .current{
    background-color: rgba(0,0,0,.1);
  }
}
.login-form{
  margin-top: 29px;
  label{
    display: block;
    font-size: 14px;
    color:white;
    margin-bottom: 3px;
  }
  .item-form{
  margin-bottom: 13px;
} 
  .block{
    width: 100%;
    display: block;
  }
  .login-btn{
    margin-top: 19px;
  }
}

</style>