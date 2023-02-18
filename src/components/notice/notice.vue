<template>
  <div class="notice">
    <div class="top">
      <span>
        消息中心
      </span>
    </div>
    <div class="noticeBox">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="系统通知" name="first">
          <div class="noticeList"  v-for="(item,i) in noticeList.systemNotice" :key="i">
            <div class="avatar">
              <el-avatar :src="imgUrl"></el-avatar>
            </div>
            <div class="right">
              <div class="title">
                <el-badge is-dot class="item" v-if="!item.noticeRead">{{ item.title }}</el-badge>
                <span v-else>{{ item.title }}</span>
              </div>
              <p class="content" >{{item.content}}</p>
              <div class="createTime">{{ item.createTime }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="新闻通知" name="second">
          <div class="noticeList"  v-for="(item,i) in noticeList.newsNotice" :key="i">
            <div class="avatar">
              <el-avatar :src="imgUrl"></el-avatar>
            </div>
            <div class="right">
              <div class="title">
                <el-badge is-dot class="item" v-if="!item.noticeRead">{{ item.title }}</el-badge>
                <span v-else>{{ item.title }}</span>
              </div>
              <p class="content" >{{item.content}}</p>
              <div class="createTime">{{ item.createTime }}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订阅发布者" name="third">暂无消息</el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'News',
  data () {
    return {
      activeName: 'first',
      imgUrl:"http://p3-sign.toutiaoimg.com/tos-cn-i-hiq46c5yrr/notice_icon/system_notice2.png~noop.image?x-expires=1679302559&x-signature=DyQbTyPfoPQcl%2BYU78yBulNpRwI%3D",
      input:'',
      noticeList: {
        newsNotice: [],
        systemNotice:[]
      }
      }
  },
  mounted() { 
    this.getNoticeList()
  },
  methods: {
    handleClick(tab, event) {
        console.log(tab, event);
    },
    getNoticeList() {
      this.axios({
        methods: "GET",
        url:"/api/notices/list"
      }).then(res => {
        var records=res.data.data.records
        this.noticeList.newsNotice = records.filter((e) => e.title === "新闻通知");
        this.noticeList.systemNotice = records.filter((e) => e.title==="系统通知");
        console.log(this.noticeList);
      }).catch(err => {
        console.log(err);
      })
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
.noticeBox {
  margin: 0px auto;
}
.noticeList {
  display: flex;
  border-bottom: #d3c8c8 1px solid;
}
.noticeList .avatar{
  display: flex;
  justify-content: center;
    /* justify-self: center; */
    flex-direction: column;
}
.noticeList .right {
  display: flex;
  flex-direction: column;
  margin: 10px 20px;
  text-align: left;
}
.noticeList .right .title, .noticeList .right .createTime{
  /* margin: 10px 0; */
  font-size: 14px;
  color: rgb(76, 82, 88);
}
  a{
    text-decoration: none;
    color: #ffff;
  }
</style>
