<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li  v-for="item in menuTab" :key="item.id" :class="{'current':item.current}" @click="toggleMenu(item)">{{item.txt}}</li>
      </ul>

      <!--表单-->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="login-form" size="medium ">
        
        <el-form-item  prop="username" class="item-form">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
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
            <el-col :span="16"><el-input v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input></el-col>
            <el-col :span="8"><el-button type="success" class="block">获取验证码</el-button></el-col>
          </el-row>
          
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
import { reactive,ref, isRef, toRefs, onMounted} from '@vue/composition-api'
import {stripscript,validateEmail,validatePasswrd,validateVCode } from '@/utils/validate.js';
export default {
    name:'login',
    
    //若为setup(props,context) 这样要变成context.refs
    setup(props, {refs }){

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
      const menuTab =reactive([                                //声明单一变量用reactivr
          { txt:'登录',current: true, type: 'login'},
          { txt:'注册',current: false, type: 'register'}
        ])

      //模块值
        const model= ref('login')                              //声明基础类型变量用ref

      //表单的数据
      const ruleForm = reactive ({
          username: '',
          password: '',
          passwords: '',
          code: ''
        })

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
        })
      
    

      //声明函数
      const toggleMenu =(data => {
        menuTab.forEach((elem,index) => {
          elem.current=false
        });

        //高光
        data.current = true

        //修改模块值
        model.value = data.type
      })
      const submitForm = (formName => {
        refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      })

      //生命周期 
      //挂载完成后执行：
      onMounted(() => {

      })
      return {
        menuTab,
        model,
        ruleForm,
        rules,
        toggleMenu,
        submitForm
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