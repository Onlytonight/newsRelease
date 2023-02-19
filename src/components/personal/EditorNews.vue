<template>
  <div class="editorNews">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" >
    <el-form-item label="新闻标题" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>
    <el-form-item label="新闻栏目" prop="plateId" >
      <el-select v-model="ruleForm.plateId"  :placeholder="ruleForm.plateName?ruleForm.plateName:'请选择新闻栏目'" :position="12" style="z-index: 100;">
        <el-option :label="item.name" :value="item.id" v-for="(item,index) in plateList" :key="index" ></el-option>
        <!-- 0：时政 1：文教 2：科技 3：体育 4：社会 5：其他 ：所有 -->
      </el-select>
    </el-form-item>
    <el-form-item label="新闻封面" prop="coverUrl">
      <el-upload
        drag
        name="image"
        class="avatar-uploader"
        action="/api/common/upload/image"
        :headers="uploadHeader"
        :show-file-list="false"
        :on-success="handleAvatarSuccess">
        <img v-if="ruleForm.coverUrl" :src="ruleForm.coverUrl"  width="360px" >
        <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
      </el-upload>
      <el-button size="small" v-show="ruleForm.coverUrl" type="primary" @click="()=>ruleForm.coverUrl=''">取消封面</el-button>

      <!-- <el-input v-model="ruleForm.coverUrl"></el-input> -->
    </el-form-item>
    <el-form-item label="新闻内容" prop="content">
      <!-- <el-input type="textarea" v-model="ruleForm.content"></el-input> -->
    <editor ref="editorOne" v-model="ruleForm.content"  @change="change" ></editor>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="saveDraft('ruleForm',1)">保存为草稿</el-button>
      <el-button type="primary" @click="saveDraft('ruleForm',0)">发布新闻</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
    </el-form>
  </div>
  </template>
  
<script>
import Editor from './MyEditor.vue'

export default {
  components: { Editor},
  data() {
    return {
      detail: "",
      ruleForm: {
        title: '',
        plateId: '',
        content: '',
        coverUrl:'',
        status: 0,
        // coverUrl:''
      },
      plateList:[],
      rules: {
        title: [
          { required: true, message: '请输入新闻标题', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        plateId: [
          { required: true, message: '请选择新闻类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入新闻内容', trigger: 'blur' }
        ]
      },
      uploadHeader: {
        'token': window.sessionStorage.getItem('token')
      }
      
    }
  },  
  mounted() {
    this.getPlateList();
    if (this.$route.query.newsId) {
      this.axios.get(
      "/api/news/detail?newsId="+this.$route.query.newsId
      ).then(res => { 
        console.log(res.data.data);
      this.ruleForm = res.data.data;
      // this.ruleForm.label=res.data.data.label.split(",")
      console.log(res);
    }).catch(err => { 
      console.log(err);
    })
    // console.log(this.ruleForm);
    } 
    
  },
  methods: {
    change(val) {
        console.log(val)
    },
    handleChange(file, fileList) {
        this.fileList3 = fileList.slice(-3);
      },
    handleAvatarSuccess(res) {
      console.log(res);
      this.ruleForm.coverUrl = res.data.url;
      // this.changeProfile.alt=res.data.alt
      },
    putDraft(id) { 
      this.axios({
        method: "PUT",
        url: '/api/news/releaseNews?newsId='+id,
      }).then(res => { 
          console.log(res);
        }).catch(err => { 
          console.log(err);
      })
    },
    getPlateList() {
      this.axios({
        method: "GET",
        url:"/api/plate/list"
      }).then(res => {
        console.log(res);
        this.plateList = res.data.data.records;
      }).catch(err => { 
        console.log(err);
      })
    },
    saveDraft(formName, flag) {
      this.ruleForm.status = flag;
      this.$refs[formName].validate((valid) => {
        // this.ruleForm.label = this.ruleForm.label.toString();
          console.log(this.ruleForm);
        if (valid) {
            if (this.$route.query.newsId) {
              this.axios({
                method: "DELETE",
                url:"/news/delete?newsId="+this.$route.query.newsId
              }).then(res => {
              }).catch(err => { 
                console.log(err);
              })
            } 
              this.axios({
              method: "POST",
              url: "/api/news/add",
              data:this.ruleForm
            }).then(res => { 
              console.log(res);
              if (res.data.code == 500)
              {
                this.$message({
                  type:'error',
                  message: res.data.msg
                });
              }
              else if (res.data.code == 200) {
                this.$message({
                  type:'success',
                  message: flag?'保存成功':'已提交发布审核，请注意查看审核结果...'
                });
                this.$route.push("/personal/news")
              }
              
            }).catch(err => { 
              console.log(err);
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
    
   }
}
</script>
<style scoped>
.demo-ruleForm {
  margin: 10px;
}
</style>

  