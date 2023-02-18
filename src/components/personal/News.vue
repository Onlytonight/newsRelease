<template>
  <div class="news">
    <div class="top">
      <span>
        共收到{{newsList.length}}条新闻发布信息
      </span>
      <div class="search">
        <el-button @click="clearFilter" type="primary" >全部新闻</el-button>
        <!-- <el-input style="width: 400px;"
          placeholder="请输入内容"
          v-model="input"
          clearable>
        </el-input>
        <el-button type="primary" icon="el-icon-search" >搜索</el-button> -->
      </div>
      <div>
        <el-button type="primary" icon="el-icon-plus">
          <router-link to="/personal/editor">发布新闻</router-link>
        </el-button>
      </div>
    </div>
    <div class="newsList">
      <el-table
        ref="filterTable"
        :data="newsList"
        style="width: 100%"
        :header-cell-style="{background:'#E8EBEF'}"
        >
        <el-table-column
          label="更新时间"
          width="260">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="新闻名称"
          width="380">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="新闻栏目"
          width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.plateName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="状态"
          width="150"
          :formatter="formatter"
          :filters="[ { text: '审核中', value: '审核中' },{ text: '审核成功', value: '审核成功' },{ text: '审核不通过', value: '审核不通过' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status == '0' ?'primary': (scope.row.status == '3' ? 'error': 'success') "
              disable-transitions>{{scope.row.status == '0' ?'审核中': (scope.row.status == '3' ? '审核不通过': '审核成功')}}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
  name: 'News',
  data () {
    return {
      input:'',
      newsList: []
      }
  },
  mounted() { 
    this.getNewsList();
  },
  methods: {
    handleEdit(index, row) {
      console.log(index, row);
      this.$router.push("/detail/"+row.id)
        
      },
    handleDelete(index, row) {
        console.log(index, row);
        this.axios({
            method: "DELETE",
            url:"/api/news/delete?newsId="+this.newsList[index].id
          }).then(res => {
            console.log(res);
            this.$message({
                type:'success',
                message: '删除成功'
              });
          }).catch(err => { 
            console.log(err);
          })
    },
    getNewsList() { 
      this.axios({
        method: "GET",
        url:"/api/news/myNews"
      }).then(res => { 
        console.log(res);
        this.newsList = res.data.data.records;
      }).catch(err => { 
        console.log(err);
      })
    },
    clearFilter() {
      this.$refs.filterTable.clearFilter();
    },
    filterTag(value, row) {
      var key = {
        "审核中": 0,
        "审核成功":2,
        "审核不通过":3
      }
      console.log(key[value]);
      // var lable=value == '审核中' ?0: (scope.row.status == '3' ? '审核不通过': '审核成功')
      return row.status == key[value];
    },
    formatter(row, column) {
      console.log(456);
      return row.address;
    },
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
