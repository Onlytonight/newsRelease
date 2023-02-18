<template>
  <div class="news">
    <div class="top">
      <span @click="log">
        共有<span style="color: #f56c6c;">{{usersList.length}}</span>个栏目
      </span>
      <div>
        <el-button type="primary" icon="el-icon-plus" @click="addAuditor">
          新建栏目
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
          label="栏目名称"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="更新时间"
          width="250">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.updateTime.substring(0,10)+" "+scope.row.updateTime.substring(11,19)}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              plain
              @click="deleteColumn(scope.row.id)">删除</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              @click="updateVisible=true;updateid=scope.row.id">更新</el-button>
          </template>
        </el-table-column>
        </el-table>
    </div>
  <!-- 新建弹框 -->
  <el-dialog title="新建审核员账号" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="accountForm"  :rules="rules" ref="formName" label-width="100px" class="demo-accountForm">
        <el-form-item label="栏目名" >
          <el-input type="text" v-model="accountForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm()">取 消</el-button>
        <el-button type="primary" @click="addAuditor('accountForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 更新弹框 -->
    <el-dialog title="新建审核员账号" :visible.sync="updateVisible" width="30%">
      <el-form :model="accountForm"  :rules="rules" ref="formName" label-width="100px" class="demo-accountForm">
        <el-form-item label="栏目名" >
          <el-input type="text" v-model="accountForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateColumn(updateid)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'News',
  data () {
    return {
      input:'',
      usersList: [],
      dialogFormVisible: false,
      updateVisible:false,
      banUserId:'',
      updateid:'',
      duration:1,
      accountForm: {
        name:'',
      },
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
        url:"/api/plate/listByAdmin",
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
        this.axios({
          method: "POST",
          url: "/api/plate/add",
          data:this.accountForm,
          header:{
            token:sessionStorage.getItem("token")
          }
        }).then(res => { 
          console.log(res);
          if(res.data.code===200){
            this.$message({
              type:'success',
              message: "新建成功"
            }) 
          this.dialogFormVisible=false
          location. reload()
          }
          else 
            this.$message({
                type:'warning',
                message: res.data.msg
              }) 
        }).catch(err => { 
          console.log(err);
        })
    },
    resetForm() {
        this.dialogFormVisible=false
        this.$refs[formName].resetFields();
    },
    deleteColumn(id){
      this.axios({
          method: "delete",
          url: "/api/plate/delete?plateId="+id,
          header:{
            token:sessionStorage.getItem("token")
          }
        }).then(res => { 
          console.log(res);
          if(res.data.code===200){
            this.$message({
              type:'success',
              message: "删除成功"
            }) 
          location. reload()
          }
          else 
            this.$message({
                type:'warning',
                message: res.data.msg
              }) 
        }).catch(err => { 
          console.log(err);
        })
    },
    updateColumn(id){
      this.axios({
          method: "put",
          url: "/api/plate/update",
          header:{
            token:sessionStorage.getItem("token")
          },
          data:{
            name:this.accountForm.name,
            id:id
          }
        }).then(res => { 
          console.log(res);
          if(res.data.code===200){
            this.$message({
              type:'success',
              message: "修改成功"
            }) 
          location. reload()
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
