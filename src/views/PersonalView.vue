<template>
  <div class="personal">
    <el-container style="height: 100vh">
      <el-header style="padding: 0px !important;">
        <Header :info="info" />
      </el-header>

      <el-container> 
        <el-aside width="220px" v-if="isShow">
            <Aside />
        </el-aside>

        <el-main>
          <div class="myMain">
          <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '../components/container/Header.vue';
import Aside from '../components/container/Aside.vue';
import Profile from '../components/personal/Profile.vue'
import router from '../router';
export default {
  components:{ Header, Aside, Profile, router },
  data() {
    return {
      logo: "~@/assets/img/logo.png",
      info: {
        title: '个人中心',
        back:true
      },
      isShow:true
    }
  },
  mounted() {
    if (this.$route.fullPath==="/notice") {
      this.isShow = false
    }
    // console.log(this.$route);
  }

 
}
</script>

<style scoped>
  .el-aside {
    margin-top: 5px;
    background-color: #FFFFFF;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: rgb(244, 246, 252);
    color: #333;
    text-align: center;
    padding: 30px;
  }
  .el-main .myMain {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    box-shadow: 0px 0px 10px 1px rgba(33,38,57,0.1);
    border-radius: 8px 8px 8px 8px;
    opacity: 1;
    box-sizing: border-box;
    padding: 20px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
