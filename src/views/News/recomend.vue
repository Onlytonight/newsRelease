<template>
  <div class="personal">
    <el-container style="height: 100vh">
      <el-header style="padding: 0px !important;">
        <Header :info="info" />

        <el-row>
          <el-col :span="24">
            <div class="grid-content bg-purple-dark">
              <el-carousel :height="bannerHeight + 'px'">
                <!--遍历图片地址,动态生成轮播图-->
                <el-carousel-item v-for="item in img_list" :key="item.id">
                  <img :src="item.coverUrl" @click="newsDetail(item.id)"/>
                </el-carousel-item>
              </el-carousel>
            </div>
          </el-col>
        </el-row>
        <el-row class="bg-purple-light">
          <el-col :span="12">
            <div class="grid-content">
              <div class="three-left" >
                <!-- <el-skeleton-item v-if="middle_list[0].image==null" variant="image" /> -->
                <!-- <img v-else v-bind:src="'https://demo.xqstudy.top'+middle_list[0].image" @click="newsDetail(middle_list[0].newsId)"> -->
                <img v-bind:src="middle_list[0].coverUrl" @click="newsDetail(middle_list[0].id)">
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content">
              <div class="two-right">
                <div v-for="item in middle_list" :key="item.id" class="item">
                  <div @click="newsDetail(item.id)">{{item.content}}</div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        
        <el-row class="newsClass">
          <el-col :span="24">
            新闻专题分类
          </el-col>
        </el-row>

        <el-row class="Class">
          <el-col :span="24">
            <el-tabs v-model="activeName" @tab-click="handleClick" stretch="true">
              
              <el-tab-pane v-for="column in columnList" :key="column.id" v-bind:label="column.name" name="first"></el-tab-pane>
              <!-- <el-tab-pane label="时政" name="second"></el-tab-pane>
              <el-tab-pane label="文教" name="third"></el-tab-pane>
              <el-tab-pane label="科技" name="fourth"></el-tab-pane>
              <el-tab-pane label="体育" name="fifth"></el-tab-pane>
              <el-tab-pane label="社会" name="sixth"></el-tab-pane>
              <el-tab-pane label="其他" name="seventh"></el-tab-pane> -->
            </el-tabs>

            <el-row class="bg-purple-light" v-for="news in news_list" :key="news.newsId">
              <el-col :span="12">
                <div class="grid-content">
                  <div class="three-left">
                    <!-- <el-skeleton-item v-if="news.image==null" variant="image" /> -->
                    <!-- <img v-else v-bind:src="'https://demo.xqstudy.top'+news.image" @click="newsDetail(news.newsId)"> -->
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content">
                  <div class="two-right">
                    <h6 @click="newsDetail(news.id)">{{news.title}}</h6>
                    <!-- <label>作者：{{news.username}}</label> -->
                    <p @click="newsDetail(news.id)" v-html="news.content"></p>
                  </div>
                </div>
              </el-col>
            </el-row>
            <p v-if="this.news_getlist.length==0">没有更多了~</p>
          </el-col>
        </el-row>
      </el-header>
    </el-container>
  </div>
</template>

<script>
import Header from '../../components/container/Header.vue';
export default {
  components:{ Header },
  data() {
    var img = require("../../assets/img/login.png");
    return {
      login: "~@/assets/img/login.png",
      info: {
        title: '新闻浏览',
        back:false
      },
      img_list: [img, img, img, img],
      columnList:[],
      middle_list:[],
      news_list:[],
      news_getlist:[],
      count:1,
      bannerHeight: 400,
      screenWidth: 0,
      activeName: 'first',
      threeImg:"~@/assets/img/login.png",
      recomendTitle:"舞台艺术—— 描绘万里河山 彰显时代气象(坚持“两创” 书写史诗)",
      recomendDetail:"新时代十年，中华优秀传统文化得到创造性转化、创新性发展，文化事业日益繁荣。舞台艺术创作百花齐放，优秀作品竞相涌现。全国艺术表演团体机构数和国内演出观众人次稳步增长。2021年，全国艺术表演团体达到18370个，比2012年增加11049家。热忱描绘新时代新征程的恢弘气象，成为广大舞台艺术工作者的不懈追求和自觉实践。",
    }
  },
  methods: {
    debounce(fn, delay) {
      let timer = null; // 借助闭包
      return function () {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(fn, delay); // 简化写法
      };
    },
    load () {
      let scrollTop=document.documentElement.scrollTop//滚动条在Y轴滚动过的高度
      let scrollHeight=document.documentElement.scrollHeight//滚动条的高度
      let clientHeight=document.documentElement.clientHeight//浏览器的可视高度
      if(scrollTop + clientHeight == scrollHeight){
        console.log('触底了');
        if(this.news_getlist.length==0){
          return ;
        }else{
          let arr = this.news_getlist.splice(0,5)
          for (var item of arr) {
            this.news_list.push(item);
          }
          console.log(this.news_list)
        }
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event,tab.index);
      console.log(tab.index)
      this.newsClass(tab.index-1)
    },
    newsDetail(id){
      window.removeEventListener('scroll', this.load);
      this.$router.push("/detail/"+id)
    },
    newsClass(clas){
      let that = this
      this.axios({
        method:'get',
        url:'/api/search/news?kind='+clas,
      }).then(function(response) {
        console.log(response)
        if(response.data.code===200){
          if(response.data.data.records.length!=0){
            let record = response.data.data.records[0]
            that.news_getlist = response.data.data.records
            that.news_getlist.splice(0,1);
            that.news_list=[]
            that.news_list.push(record)
            console.log(record)
          }else that.news_list=[]

        }else{
          if(response.data.code!=3001)
            that.$message({
              message: response.data.msg,
              type: 'warning'
            });
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
        that.$message({
          message: error,
          type: 'error'
        });
      });
    },
  },
  mounted(){
    // this.newsClass("-1")
    document.addEventListener('scroll', this.debounce(this.load, 500))
    let that = this
      this.axios({
        method:'get',
        url:'/api/news/hot',
        header:{
          token:sessionStorage.getItem("token")
        }
      }).then(function(response) {
        console.log(response)
        if(response.data.code===200){
          that.img_list = response.data.data
          that.middle_list = response.data.data.slice(0,4)
        }else{
          if(response.data.code!=3001)
            that.$message({
              message: response.data.msg,
              type: 'warning'
            });
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
        that.$message({
          message: error,
          type: 'error'
        });
      });

      this.axios({
        method:'get',
        url:'/api/plate/list',
        header:{
          token:sessionStorage.getItem("token")
        }
      }).then(function(response) {
        console.log(response)
        if(response.data.code===200){
          that.columnList = response.data.data.records
        }else{
          if(response.data.code!=3001)
            that.$message({
              message: response.data.msg,
              type: 'warning'
            });
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
        that.$message({
          message: error,
          type: 'error'
        });
      });
  },
  destroyed(){
    window.removeEventListener('scroll', this.load);
  },
}
</script>

<style scoped>
  
  body > .el-container {
    margin-bottom: 40px;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 400px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .el-carousel__item img{
    cursor: pointer;
    height: 100%;
  }
  .two-left{
    width: 86%;
    height: 300px;
    transform: translate(10%, 50px);
    background: url("~@/assets/img/login.png");
    background-size: 100%;
  }

  .three-left{
    width: 86%;
    height: 300px;
    transform: translate(10%, 50px);
  }

  .three-left img, .three-left div{
    width: auto;
    height: 100%;
  }
  .three-left img{
    cursor: pointer;
  }
  .two-right{
    width: 86%;
    height: 300px;
    transform: translate(4%, 50px);
    display: flex;
    flex-direction: column;
  }
  .item{
    flex: 1;
    background: #99a9bf;
    margin: 4px;
    border-radius: 10px;
  }
  .item:hover{
    cursor: pointer;
    text-decoration: underline;
  }
  .item div{
    width: 80%;
    height: 70%;
    transform: translate(10%, 15%);
    text-align: left;
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    word-break: break-all;
    -webkit-box-orient: vertical;
  }
  .newsClass{
    background:#002FA7;
    padding: 20px;
    color: white;
    font-size: 30px;
    font-weight: bold;
    letter-spacing:30px;
  }
.two-right h6{
  margin: 0;
  font-size: 24px;
  font-family: Segoe UI-Bold, Segoe UI;
  font-weight: bold;
  color: #333333;
  -webkit-background-clip: text;
}
.two-right h6:hover,.two-right p:hover{
  text-decoration: underline;
  cursor: pointer;
}
.two-right p{
  font-size: 16px;
  font-family: Segoe UI-Regular, Segoe UI;
  font-weight: 400;
  color: #333333;
  line-height: 36px;
  -webkit-background-clip: text;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  word-break: break-all;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
.infinite-list{
  height: 300px;
}
</style>