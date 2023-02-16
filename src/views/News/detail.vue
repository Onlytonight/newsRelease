<template>
  <div class="personal">
    <el-container style="height: 100vh">
      <el-header style="padding: 0px !important;">
        <Header :info="info" />
      </el-header>

        <el-row class="newsClass">
          <el-col :span="24">
            新闻专题分类
          </el-col>
        </el-row>

        <el-row class="container">
          <el-col :span="24">
              <div class="content">
                <h6>{{recomendTitle}}</h6>
                <p style="cursor:pointer;" @click="comeTo(userId)">作者：{{username}}</p>
                <div>
                    <p class="author">标签：{{author}}
                    <el-button type="danger" icon="el-icon-thumb" @click="like">{{isLike?likeNum:"点赞"}}</el-button>
                    <!-- <el-button type="warning" icon="el-icon-star-off" @click="collect">{{collectId!=null?collectNum:"收藏"}}</el-button> -->
                    </p>
                    <!-- <p class="gray">{{time}}&nbsp;|&nbsp;来源于：{{comeFrom}}</p> -->
                </div>
                <img v-if="this.image!=''" v-bind:src="image" class="img"/>
                <div v-html="recomendDetail" class="detail"></div>
              </div>
          </el-col>
        </el-row>
        <comment
        @doSend="doSend($event)"
        @doChidSend="doChidSend(arguments)"
        :commentList="commentList"
        :commentNum="commentNum"
        :label="label"
        :avatar="avatar"
        :placeholder="placeholder"
        :minRows="minRows"
        :maxRows="maxRows"
      ></comment>
    </el-container>
  </div>
</template>

<script>
import Header from '../../components/container/Header.vue';
import comment from '../../components/comment/Comment.vue'
import avatar from '../../assets/avatar.png'
export default {
  components:{ Header ,comment},
  data() {
    return {
      info: {
        title: '新闻浏览',
        back:true
      },
      token:'',
      newsId:1,
      isLike:null,
      likeNum:0,
      collectId:null,
      collectNum:0,
      author:"",
      userId:'',
      username:'',
      time:"",
      comeFrom:"",
      image:'',
      recomendTitle:"",
      recomendDetail:"",
      label: "SVIP",
      placeholder: "说点什么吧",
      minRows: 4,
      maxRows: 4,
      commentNum: 0,
      avatar: avatar,
      commentList: [
        {
          id: 1,
          commentUser: {
            id: 1,
            nickName: "花非花",
            avatar:
              "http://qzapp.qlogo.cn/qzapp/101483738/6637A2B6611592A44A7699D14E13F7F7/50",
          },
          content:
            "<a style='text-decoration:none;color: #409eff ' href='https://blog.csdn.net/qq_40942490?spm=1000.2115.3001.5113'>我的CSDN博客地址</a>[害羞][害羞][害羞]<br/>",
          createDate: "2019-9-23 17:36:02",
          childrenList: [
            {
              id: 2,
              commentUser: {
                id: 2,
                nickName: "坏菠萝",
                avatar: "",
              },
              targetUser: {
                id: 1,
                nickName: "花非花",
                avatar:
                  "http://qzapp.qlogo.cn/qzapp/101483738/6637A2B6611592A44A7699D14E13F7F7/50",
              },
              content: "真的就很棒！很Nice!",
              createDate: "2019-9-23 17:45:26",
            },
          ],
        },
      ],

    }
  },
  created(){
    this.newsId = this.$route.params.id
    this.token = sessionStorage.getItem('token')
    this.init()
  },
  methods: {
    comeTo(id){
      console.log(1)
      this.$router.push("/user/"+id)
    },
    myaxios(method,url,type,data){
      let that = this
      this.axios({
        method:method,
        url:url,
        header:{
          "token":this.token
        },
        data:data,
      }).then(function(response) {
        console.log(response)
        if(response.data.code===200){
          if(type =='like'){
            that.likeId=1
            that.likeNum+=1
          }else if(type=='dlike'){
            that.likeId=null
            that.likeNum-=1
          }else if(type=='collect'){
            that.collectId=response.data.data
            if(method=="delete") {
              that.collectId=null
              that.collectNum-=1
            }
            else that.collectNum+=1
          }else if(type=='comment'){
            location. reload()
          }
        }else{
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
    init(){
      let that = this
      this.axios({
        method:'get',
        url:'/api/news/detail?newsId='+this.newsId,
        header:{
          "token":this.token
        },
      }).then(function(response) {
        // console.log(response)
        let news = response.data.data
        // console.log(news)
        if(response.data.code===200){
          if(news.image!=null) that.image = "https://demo.xqstudy.top"+news.image
          that.recomendTitle = news.title
          that.recomendDetail = news.content
          that.time = news.updateTime
          that.author = news.plateName
          that.username= news.nickName
          that.userId = news.userId
          that.likeNum = parseInt(news.likeNum)
          that.isLike=news.isLike
        }else{
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
        url:'/api/comment/list?newsId='+this.newsId,
        header:{
          "token":this.token
        },
      }).then(function(response) {
        console.log(response)
        let comments = response.data.data.records
        that.commentNum = comments.length
        if(response.data.code===200){
          that.commentList=[]
          let indexNum=1
          for(let item of comments){
            // 获取二级评论
            let children = []
            for(let sec of item.replyList){
                  // console.log(sec)
                  let chird ={
                    id: indexNum++,
                    index:sec.replyId,
                    commentUser: {
                      id: sec.userId,
                      nickName: sec.nickName,
                      avatar: sec.avatar||"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    },
                    targetUser: {
                      id: sec.toUserId,
                      nickName: item.nickName,
                      avatar:sec.toAvatar||"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                    },
                    content: sec.content,
                    createDate: sec.createTime.substring(0,10)+" "+item.createTime.substring(11,19),
                  }
                  // console.log(chird)
                  children.push(chird)
                }

            let comment ={
              id: indexNum++,
              index:item.comId,
              commentUser: {
                id: item.userId,
                nickName: item.nickName,
                avatar:item.avatar||"https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
              },
              content:item.comment,
              createDate: item.createTime.substring(0,10)+" "+item.createTime.substring(11,19),
              childrenList: children,
            }
            // console.log(comment)  
            that.commentList.push(comment)
          }
        }else{
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
    like(){
      if(this.likeId!=null){
        let data = {
          "newsId":this.newsId,
          "ops":0
        }
        this.myaxios("post","/api/news/like","dlike",data)
      }else{
        let data = {
          "newsId":this.newsId,
          "ops":1
        }
        this.myaxios("post","/api/news/like",'like',data)
      }
    },
    collect(){
      if(this.collectId!=null){
        this.myaxios("delete","/api/collect/cancelCollect?collectId="+this.collectId,"collect")
      }else{
        this.myaxios("put","/api/collect/giveCollect?newsId="+this.newsId,"collect")
      }
    },
    doSend(content) {
      console.log("初始发送按钮点击事件：" + content);
      let data = {
        "newsId":this.newsId,
        "comment":content
      }
      this.myaxios("post","/api/comment/add","comment",data)
    },
    doChidSend(args) {
      // console.log("评论区发送按钮点击事件：");、、
      // console.log(args)
      // console.log("content=" + args[0]);
      // console.log("targetUserId=" + args[1]);
      // console.log("父级评论id=" + args[2]);
      let data  = {
        "comId": args[2],
        "content": args[0],
        }
      this.myaxios("post","/api/reply/add","comment",data)
    },
  },
}
</script>

<style scoped>
.img{
    width: auto;
    height: 250px;
    background: url("~@/assets/img/logo.png");
    background-size: 100%;
}
.newsClass{
    background:#002FA7;
    padding: 20px;
    color: white;
    font-size: 40px;
    font-weight: bold;
    letter-spacing:30px;
  }

.personal{
  background: #F5F7FD;
}

.content h6{
    font-size: 36px;
    font-family: Segoe UI-Bold, Segoe UI;
    font-weight: bold;
    color: #333333;
    line-height: 0px;
    -webkit-background-clip: text;
}
.detail,.content p{
    width: 80%;
    transform: translateX(10%);
    text-align: left;
    font-size: 20px;
    font-family: Segoe UI-Regular, Segoe UI;
    font-weight: 400;
    color: #333333;
    background-color: #F0F8FF;
    -webkit-background-clip: text;
}
.author{
  font-weight: bold!important;
}
.author button{
  margin: 0 0 0 15px;
}
.gray{
    color: gray!important;;
}
</style>