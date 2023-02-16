<template>
  <div>
    <div class="profile" v-if="!isChange">
    <div class="img">
      <img :src="profile.avatar" alt="" width="150px" height="150px">
    </div>
    <div class="information">
      <el-descriptions title="个人信息" :column="1" >
        <el-descriptions-item label="昵称">{{ profile.nickName }}</el-descriptions-item>
        <el-descriptions-item label="账号">{{ profile.username }}</el-descriptions-item>
        <el-descriptions-item label="角色"><el-tag>{{ profile.roleName }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="绑定邮箱">{{ profile.email }}</el-descriptions-item>
        <!-- <el-descriptions-item label="性别">{{ profile.sex?'男':'女' }}</el-descriptions-item>
        <el-descriptions-item label="关注">{{ profile.focusNum }}</el-descriptions-item> -->
        <!-- <el-descriptions-item label="粉丝">
          <el-tag size="small">{{ profile.fansNum }}</el-tag>
        </el-descriptions-item> -->
        <el-descriptions-item label="所在地区">江苏省苏州市吴中区吴中大道 1188 号</el-descriptions-item>
        <!-- <el-descriptions-item label="个人简介">{{ profile.introduce }}</el-descriptions-item> -->
      </el-descriptions>
    </div>
    
    </div>
    <div class="profile" v-else>
    <div class="img">
      <!-- <img :src="profile.avatar" alt=""> -->
              <!-- action="https://jsonplaceholder.typicode.com/posts/" -->
      <el-upload
        name="image"
        class="avatar-uploader"
        action="/api/common/upload/image"
        :headers="uploadHeader"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="changeProfile.avatar" :src="changeProfile.avatar" class="avatar" :alt="changeProfile.alt">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <div class="information">
      <el-descriptions title="个人信息" :column="1" >
        <el-descriptions-item label="昵称"><el-input style="width: 450px;" v-model="changeProfile.nickName"></el-input></el-descriptions-item>
        <el-descriptions-item label="账号">{{ profile.username }}</el-descriptions-item>
        <el-descriptions-item label="角色"><el-tag>{{ profile.roleName }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="绑定邮箱">{{ profile.email }}</el-descriptions-item>
        <!-- <el-descriptions-item label="关注">{{ profile.focusNum }}
        </el-descriptions-item>
        <el-descriptions-item label="粉丝数">
          <el-tag size="small">{{ profile.fansNum }}</el-tag>
        </el-descriptions-item> -->
        <!-- <el-descriptions-item label="个人简介">
          <el-input type="textarea" v-model="changeProfile.introduce"></el-input>
        </el-descriptions-item> -->
      </el-descriptions>
    </div>
    
    </div>
    <div class="footer">
      <el-button type="primary" @click="changeInfo" v-if="!isChange">修改信息</el-button>
      <el-button type="primary" @click="putInfo" v-if="isChange">确认修改</el-button>
      <el-button type="info" plain @click="cancel" v-if="isChange">取消</el-button>
    </div>
  </div>


</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      profile: {},
      isChange: false,
      changeProfile: {
        nickName: "", //昵称
        avatar: "", //头像
        alt:""
      },
      uploadHeader: {
        'token': window.sessionStorage.getItem('token')
      }
    }
  },
  mounted() { 
    this.getProfile();
  },
  methods: { 
    handleAvatarSuccess(res, image) {
      console.log(res);
      this.changeProfile.avatar =  res.data.url;
      this.changeProfile.alt=res.data.alt
      // this.axios({
      //   method: "POST",
      //   url: "/api/common/upload/image",
      //   headers: {'Content-Type': 'multipart/form-data'},
      //   data: {
      //     image: image
      //   }
      // }).then(res => { 
      //   console.log(res);
      //   this.changeProfile=res.data.data
      // }).catch(err => { 
      //   console.log(err);
      // })
        // this.changeProfile.avatar = URL.createObjectURL(file.raw);
      },
    beforeAvatarUpload(file) {
        console.log(file);
        const isJPG = file.type === 'image/jpeg';
        const isLt5M = file.size / 1024 / 1024 < 5;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isLt5M;
      },
    changeInfo() { 
      this.isChange = true;
    },
    putInfo() { 
      this.axios({
        method: "PUT",
        url: "/api/user/updateInfo",
        data: this.changeProfile
      }).then(res => { 
        console.log(res);
        this.profile = res.data.data;
        this.isChange = false;
      }).catch(err => { 
        console.log(err);
      })
    },
    cancel() { 
      this.isChange = false;
    },
    getProfile() { 
      this.axios.get("/api/user/info").then(res => { 
        this.profile = res.data.data;
        console.log(res);
      }).catch(err => { 
        console.log(err);
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.profile {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 20px auto;
  margin-right: 50px;
  box-sizing: border-box;
}
.img {
  flex: 1;
}
.profile .information {
  margin-left: 30px;
  flex: 5;

}
.inputInformation {
  flex:3
}

/* .avatar-uploader {
  border: 1px solid grey;
} */
.avatar-uploader {
    border: 1px dashed #d9d9d9 !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
.avatar-uploader:hover {
    border-color: #409EFF !important;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
