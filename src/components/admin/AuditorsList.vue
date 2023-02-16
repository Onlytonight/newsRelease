<template>
  <div class="news">
    <div class="top">
      <span>
        共获取<span style="color: #f56c6c;">{{auditorsList.length}}</span>条审核员账号信息
      </span>

      <!-- <div>
        <el-button type="primary" icon="el-icon-plus" @click="addAuditor">
          新建审核员账号
        </el-button>
      </div> -->
    </div>
    <div class="auditorsList">
      <el-table
        :data="auditorsList"
        style="width: 100%"
        :header-cell-style="{background:'#E8EBEF'}"
        >
        <el-table-column
          label="名称"
          width="150">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="公司"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.company }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="申请时间"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.applyTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.approveStatus!=0?scope.row.approveStatus==1?"已通过":"未通过":"未审核" }}</span>
            <!-- <span style="margin-left: 10px">{{ scope.row.approveStatus==0?"不通过":"已通过" }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="pass(1, scope.row.id)">通过</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="pass(2, scope.row.id)">不通过</el-button>
          </template>
        </el-table-column>
        </el-table>
    </div>
    
    <!-- 修改密码弹框 -->
    <el-dialog title="修改审核员密码" :visible.sync="changeFormVisible" width="30%">
      <el-form :model="changeForm"  :rules="rules" ref="changeForm" label-width="100px" class="demo-accountForm">
        <el-form-item label="账号" prop="account" >
          <el-input type="text" v-model="changeForm.account" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input type="password" v-model="changeForm.pwd" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('changeForm')">取 消</el-button>
        <el-button type="primary" @click="changeAuditorPwd('changeForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'News',
  data() {
    return {
      input:'',
      auditorsList: [],
      dialogFormVisible: false,
      changeFormVisible:false,

      changeForm: {
        account: '',
        pwd:''
      },
    }
  },
  mounted() { 
    this.getAuditorsList();
  },
  methods: {
    pass(e,id){
      console.log(e,id)
      let token = sessionStorage.getItem("token")
      this.axios({
        method: "POST",
        url: "/api/apply/publisher/audit",
        header:token,
        data:{
          approveStatus:e,
          id:id
        }
      }).then(res => { 
        if (res.data.msg==="ok") {
          this.$message({
            type:'success',
            message: "操作成功"
          }) 
          location. reload()

        }else{
          this.$message({
          type:'warning',
          message: res.data.msg
        }) 
        }
      }).catch(err => { 
        console.log(err);
      })
    },
    handleEdit(index, row) {
      this.changeForm.account = row.account;
      this.changeFormVisible = true;
      this.changeAuditorPwd('accountForm');
      },
    handleDelete(index, row) {
      console.log(index, row);
      this.deleteAuditor(row.id, row.account);
    },
    getAuditorsList() { 
      this.axios({
        method: "GET",
        url:"/api/apply/publisher/list"
      }).then(res => { 
        console.log(res);
        this.auditorsList = res.data.data.records;
      }).catch(err => { 
        console.log(err);
      })
    },
    // 新建管理员账号
    // 修改密码
    changeAuditorPwd(formName) {
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios({
              method: "PUT",
              url: "/api/admin/changeAudit",
              data:this.changeForm
            }).then(res => { 
              if (res.data.msg==="ok") {
                this.$message({
                type:'success',
                message: "修改密码成功"
              }) 
              }
            }).catch(err => { 
              console.log(err);
            }),
          this.resetForm('accountForm');
          } else {
            this.$message({
                type:'error',
                message: "密码不符合要求"
              });
            return false;
          }
      });
    },
    // 注销审核员账号
    deleteAuditor(id,account) {
      this.axios({
        method: "DELETE",
        url: "/api/admin/delAudit?id=" + id,
        data: {
          account:account
        }
      }).then(res => { 
        console.log(res);
        if (res.data.msg === "ok") {
          this.$message({
            type: 'success',
            message: "注销账号成功"
          })
        }
      }).catch(err => { 
        console.log(err);
      })
    },
    // 重置弹框
    resetForm(formName) {
      if (formName=='accountForm') {
        this.changeFormVisible=false
      } else {
        this.dialogFormVisible=false
      }
        this.$refs[formName].resetFields();
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 10px 0;
  /* width: 80%; */
}
.auditorsList {
  margin: 0px auto;
}

  a{
    text-decoration: none;
    color: #ffff;
  }
</style>
