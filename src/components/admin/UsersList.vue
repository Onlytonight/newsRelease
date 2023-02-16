<template>
  <div class="news">
    <div class="top">
      <span @click="log">
        共有<span style="color: #f56c6c;">{{usersList.length}}</span>位用户信息
      </span>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="addAuditor">
          新建审核员账号
        </el-button>
      </div>
    </div>
    
    <div class="usersList">
      <el-table
        :data="usersList"
        style="width: 100%"
        :header-cell-style="{background:'#E8EBEF'}"
        >
        <el-table-column
          label="用户昵称"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户邮箱"
          width="250">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="用户角色"
          width="200">
          <template slot-scope="scope">
            <div slot="reference" class="title-wrapper">
                <!-- <el-tag size="medium" >{{ scope.row.focus?'已封禁':'正常' }}</el-tag> -->
              <!-- <span style="margin-left: 10px">{{ scope.row.roleName }}</span> -->
              <el-select v-model="scope.row.roleName" placeholder="请选择" @change="changeRole($event,scope.row.id)">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              plain
              @click="handleEdit(scope.$index, scope.row)">解封</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleDelete(scope.$index, scope.row,false)">暂时封禁</el-button>
              <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row,true)">永久封禁</el-button>
          </template>
        </el-table-column>
        </el-table>
    </div>
    <el-dialog title="封禁时间(单位：天)" :visible.sync="dialogFormVisible" width="30%">
      <el-input-number v-model="duration" :min="1" :max="365" label="封禁天数"></el-input-number>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="bannedUser(banUserId,duration)">确 定</el-button>
      </div>
    </el-dialog>
  <!-- 新建账号弹框 -->
  <el-dialog title="新建审核员账号" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="accountForm"  :rules="rules" ref="formName" label-width="100px" class="demo-accountForm">
        <el-form-item label="账号" prop="username" >
          <el-input type="text" v-model="accountForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="accountForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="accountForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="accountForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="account">
          <el-input type="text" v-model="accountForm.nickName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm()" ref="cancelNew">取 消</el-button>
        <el-button type="primary" @click="addAuditor('accountForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'News',
  data () {
    var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.accountForm.password) {
          console.log(this.accountForm.password,value)
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      input:'',
      changeFormVisible:false,
      usersList: [],
      dialogFormVisible: false,
      banUserId:'',
      duration:1,
      accountForm: {
        username:'',
        password: '',
          checkPass:'',
          email:'',
          nickName:''
      },
      rules: {
        username: [
            {  min: 8, max: 16, message: '账号必须为8-16位',required:true,trigger: 'blur'}
          ],
          password: [
          {min: 6, max: 16, message: '密码长度不小于6位，不大于16位',required:true, trigger: 'blur' }
        ],
        checkPass: [
            { validator: validatePass2,required:true, trigger: 'blur'}
          ],
        email:[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
      },
      options: [{
          value: '1',
          label: '用户'
        }, {
          value: '4',
          label: '系统管理员'
        }, {
          value: '2',
          label: '新闻审核员'
        }],
        value: ''
      }
  },
  mounted() { 
    let token= sessionStorage.getItem('token')
    this.getUsersList(token);
  },
  methods: {
    log(){
      console.log(this.$refs.cancelNew)
      // this.$refs.cancelNew.click()
    },
    handleEdit(index, row) {
      // console.log(index, row);
      this.bannedUser(row.userId, 0);
    },
    handleDelete(index, row, forever) {
      if (forever) {
        this.bannedUser(row.userId, -99);
      } else {
        this.dialogFormVisible = true,
          this.banUserId = row.userId;
      }
    },
    getUsersList(token) { 
      this.axios({
        method: "GET",
        url:"/api/user/admin/list",
        header:token
      }).then(res => { 
        console.log(res);
        this.usersList = res.data.data.records;
      }).catch(err => { 
        console.log(err);
      })
    },
    bannedUser(userId,duration) {
      this.axios({
        method: "POST",
        url: "/api/admin/bannedUser",
        data: {
          userId:userId,
          duration:duration,
          }
          }).then(res => {
            console.log(res);
            if (res.data.code=="200") {
              this.$message({
                type:'success',
                message: '操作成功'
              });
            }
            this.dialogFormVisible = false;
            this.getUsersList(); 
          }).catch(err => { 
            console.log(err);
          })
    },
    addAuditor(formName) {
      this.dialogFormVisible = true;
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios({
              method: "POST",
              url: "/api/user/admin/addNewAuditor",
              data:this.accountForm
            }).then(res => { 
              console.log(res);
              if(res.data.code===200){
                this.$message({
                  type:'success',
                  message: "新建账号成功"
                }) 
                this.dialogFormVisible=false
              }
              else 
                this.$message({
                    type:'warning',
                    message: res.data.msg
                  }) 
            }).catch(err => { 
              console.log(err);
            })
          } else {
            this.$message({
                type:'error',
                message: "账号/密码不符合要求"
              });
            return false;
          }
      });
    },
    resetForm() {
        this.dialogFormVisible=false
        this.$refs[formName].resetFields();
    },
    open() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      changeRole(e,id){
        console.log(e,id)
        this.axios({
              method: "POST",
              url: "/api/user/admin/changeRole",
              data:{
                userId:id,
                roleId:e
              }
            }).then(res => { 
              console.log(res);
              if(res.data.code===200){
                this.$message({
                  type:'success',
                  message: "修改成功"
                }) 
              }
              else 
                this.$message({
                    type:'warning',
                    message: res.data.msg
                  }) 
            }).catch(err => { 
              console.log(err);
            })
      }
  }
}

</script>
<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 10px 0;
  /* width: 80%; */
}
.usersList {
  margin: 0px auto;
}

  a{
    text-decoration: none;
    color: #ffff;
  }
</style>
