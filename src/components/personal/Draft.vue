<template>
  <div class="news">
    <div class="top">
      <h4>
        共有{{newsList.length}}条新闻草稿
      </h4>
    </div>
    <div class="newsList">
      <el-table
        :data="newsList"
        style="width: 100%"
        :header-cell-style="{background:'#E8EBEF'}"
        >
        <el-table-column
          label="修改时间"
          width="260">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="新闻名称"
          width="570">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)" >发布</el-button>
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
        </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Draft',
  data () {
    return {
      input:'',
      newsList: [{
          createTime: '2016-05-02',
          title: '王小虎',
          type: '上海市普陀区金沙江路 1518 弄'
        }, {
          createTime: '2016-05-04',
          title: '王小虎',
          type: '上海市普陀区金沙江路 1517 弄'
        }, {
          createTime: '2016-05-01',
          title: '王小虎',
          type: '上海市普陀区金沙江路 1519 弄'
        }, {
          createTime: '2016-05-03',
          title: '王小虎',
          type: '上海市普陀区金沙江路 1516 弄'
        }]
      }
  },
  mounted() { 
    this.getNewsList();
  },
  methods: {

    handleEdit(index, row) {
      // console.log(index, row);
      this.$router.push({
        path: '/personal/editor',
        query: {
          newsId: row.id
        }
      })
      },
      handleDelete(index, row) {
        console.log(index, row);
        this.axios({
            method: "DELETE",
            url:"/api/news/delete?newsId="+this.newsList[index].id
          }).then(res => {
            console.log(res);
            this.getNewsList();
            this.$message({
                type:'success',
                message: '删除成功'
              });
          }).catch(err => { 
            console.log(err);
          })
    },
    deleteNews() { 
      
    },
    getNewsList() { 
      this.axios({
        method: "GET",
        url:"/api/news/myNews?status=1"
      }).then(res => { 
        console.log(res);
        this.newsList = res.data.data.records;
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
.newsList {
  margin: 0px auto;
}

  a{
    text-decoration: none;
    color: #ffff;
  }
</style>
