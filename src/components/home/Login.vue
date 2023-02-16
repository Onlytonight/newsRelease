<template>
  <div class="loginInput">
    <el-form :label-position="labelPosition" :model="formLabelAlign" :rules="rules">
        <el-form-item  prop="id">
            <i class="el-icon-user-solid"></i>
            <el-input v-model="formLabelAlign.id" placeholder="账号/邮箱"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
            <i class="el-icon-unlock"></i>
            <el-input v-model="formLabelAlign.password" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <el-form-item v-loading="Load">
            <el-button type="primary" @click="submit">登录</el-button>
        </el-form-item>
        <el-form-item>
            <span><router-link to="/register">注册</router-link></span>
            <span><router-link to="/forget">忘记密码</router-link></span>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
export default {
  data () {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        id: '',
        password: ''
      },
      rules: {
        id: [
        { required: true, message: '请输入账户/邮箱', trigger: 'blur' },
        ],
        password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        ],
      },
      jumpCount:3,
      Load:false,
    }
  },
  methods:{
    submit(){
        this.Load=true
        let that = this
        this.axios({
            method:'post',
            url:'/api/user/login',
            data:{
            "username": this.formLabelAlign.id, //账户
            "password": this.formLabelAlign.password //密码
            }
        }).then(function(response) {
            console.log(response)
            that.Load=false
            if (response.data.code === 200) {
                let token = response.data.data.token
                sessionStorage.setItem('token',token)
                console.log(jwt_decode(token))
                let role = jwt_decode(token).roleName
                if(role=='admin'){//管理员

                }else if(role=='publisher'){//发布者
                    that.$router.push('/personal')
                }else if(role=='auditor'){//审核员

                }else{//用户
                    //跳转到新闻推荐页，显示登录状态 
                    that.$router.push('/')
                }
            }else{
                that.$message({
                    message: response.data.msg,
                    type: 'warning'
                });
            }
        }).catch(function (error) { // 请求失败处理
            that.Load=false
            console.log(error);
            that.$message({
                message: error,
                type: 'error'
            });
        });
      },
  }
}
</script>

<style scoped>
.loginInput{
    flex: 1;
}
.loginInput form{
    width: 320px;
    position: absolute;
    top: 50%;
    left: 65%;
    transform: translate(-15%,-50%);
}
.el-input input{
    border: none!important;
}
.el-button--primary{
    width: 100%;
}
.el-form-item__content i{
    position: absolute;
    top: 15px;
    left: -30px;
}
.el-form-item__content span{
    color: #002FA7;
}
form div:nth-child(3){
    margin: 0;
}
form div:nth-child(4) div span{
    cursor: pointer;
    text-decoration: none!important;
}
form div:nth-child(4) div span:nth-child(1){
    float: left;
}
form div:nth-child(4) div span:nth-child(2){
    float: right;
}
</style>
