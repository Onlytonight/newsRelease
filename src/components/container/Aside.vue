<template>
  <div>
    <div class="aside">
    <el-row class="tac">
      <el-col >
        <el-menu
          default-active="1-1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">
          <el-menu-item v-if="roleName=='user'">
            <el-button type="primary"  slot="title" @click="apply">成为新闻发布者</el-button>
              <!-- <span slot="title">导航二</span> -->
          </el-menu-item>
          <el-submenu index="1" v-else>
            <template slot="title">
              <i class="el-icon-document-copy"></i>
              <span>新闻管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1">
                <router-link to="/personal/news">
                  发布的新闻
                </router-link>
              </el-menu-item>
              <el-menu-item index="1-2">
                <router-link to="/personal/draft">
                  新闻草稿箱
                </router-link>
              </el-menu-item>
              <!-- <el-menu-item index="1-3">收藏的新闻</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>个人管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1">
                <router-link to="/personal/profile">
                  基本信息
                </router-link>
              </el-menu-item>
              <!-- <el-menu-item index="2-2">关注&粉丝</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
    <!-- 新建账号弹框 -->
  </div>
    <el-dialog title="申请成为新闻发布者" :visible.sync="dialogFormVisible" width="30%"  center style="line-height: 0px;">
      <el-form :model="accountForm"  :rules="rules" ref="accountForm" label-width="100px" class="demo-accountForm">
        <el-form-item label="真实姓名" prop="realName" >
          <el-input type="text" v-model="accountForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input type="text" v-model="accountForm.idCard" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属公司" prop="company" >
          <el-input type="text" v-model="accountForm.company" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="line-height: 0px;">
        <el-button @click="resetForm('accountForm')">取 消</el-button>
        <el-button type="primary" @click="apply('accountForm')">确 定</el-button>
      </div>
  </el-dialog>

  </div>
  
</template>

<script>
export default {
  name: 'Aside',
  data () {
    return {
      roleName: '',
      dialogFormVisible: false,
      accountForm: {
        realName:'',
        idCard: '',
        company:''
      },
      rules: {
        realName: [
            {  message: '真实姓名不能为空',required:true,trigger: 'blur'}
          ],
        idCard: [
          {min: 18, max: 18, message: '请输入18位身份证号码',required:true, trigger: 'blur' }
        ],
        company: [
            {   message: '公司名称不能为空',required:true,trigger: 'blur'}
        ],
      }
    }
  },
  mounted() {
    this.getRoleName()
    // console.log(this.parseJwt(window.sessionStorage.getItem('token')));  
  },
  methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
    },
    parseJwt (token){
      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    },
    // 新建管理员账号
    apply(formName) {
      this.dialogFormVisible = true;
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios({
              method: "POST",
              url: "/api/apply/publisher",
              data: {
                "realName": this.accountForm.realName,
                "idCard": this.accountForm.idCard,
                "company": this.accountForm.company
              }
            }).then(res => { 
              // console.log(res);
              var msg = res.data.msg;
              if (res.data.code===200) {
                msg="恭喜您已成为新闻发布者！"
              }
              this.$message({
                type:'success',
                message: msg
              }) 
              this.dialogFormVisible = false;
              this.getRoleName();
            }).catch(err => { 
              console.log(err);
            })
          } else {
            this.$message({
                type:'error',
                message: "请按要求填写"
              });
            return false;
          }
      });
    },
    // 重置弹框
    resetForm(formName) {
      if (formName=='accountForm') {
        this.changeFormVisible=false
      } else {
        this.dialogFormVisible=false
      }
        this.$refs[formName].resetFields();
    },
    // 解析角色
    getRoleName() {
      var res = this.parseJwt(window.sessionStorage.getItem('token'));
      this.roleName = res.roleName;
      console.log(this.roleName);
    }
  }
}
</script>

<style scoped>

</style>
