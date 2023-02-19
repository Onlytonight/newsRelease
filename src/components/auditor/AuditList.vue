<template>
  <div>
    <div class="news">
    <div class="top">
      <span>
        共收到{{newsList.length}}条新闻发布信息
      </span>
      <el-button @click="clearFilter" type="primary" >全部新闻</el-button>
    </div>
    <div class="newsList">
      <el-table
        :data="newsList"
        style="width: 100%"
        :header-cell-style="{background:'#E8EBEF'}"
  
        > 
        <el-table-column
          label="发布时间"
          width="200"
          sortable
          prop="date"
          >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.updateTime.substring(0,10)+" "+scope.row.updateTime.substr(11,5) }}</span>
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
          ref="filterTable"
          prop="tag"
          label="状态"
          width="120"
          :formatter="formatter"
          :filters="[ { text: '审核中', value: '审核中' },{ text: '审核成功', value: '审核成功' },{ text: '审核不通过', value: '审核不通过' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status == '0' ?'primary': (scope.row.status == '3' ? 'danger': 'success') "
              disable-transitions>{{scope.row.status == '0' ?'审核中': (scope.row.status == '3' ? '审核不通过': '审核成功')}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="详情"
          width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="审核">
          <template slot-scope="scope" v-if="scope.row.status==0">
            <el-button size="mini" @click="open(scope.row.id,2)"  type="primary" >审核通过
            </el-button>
            <el-button size="mini" type="danger" @click="auditNews(scope.row.id,3)">打回</el-button>
            <!-- <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
          </template>
        </el-table-column>
        </el-table>
    </div>
    <div class="block" style="margin-top: 15px;">
      <el-pagination
      small
      @size-change="getNewsList"
      @current-change="getNewsList"
      :current-page.sync="current"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="size"
      layout="sizes, prev, pager, next"
      :total="total">
      </el-pagination>
    </div>
    </div>
  </div>

</template>

<script>
export default {
  name: 'AuditList',
  data () {
    return {
      input:'',
      newsList: [],
      current: 1,
      size: 10,
      total:100
      }
  },
  mounted() { 
    this.getNewsList();
  },
  methods: {
    open(id) {
      this.$alert('审核通过后将会发布该新闻', '提示', {
        confirmButtonText: '确定',
        callback: action => {
          this.auditNews(id, 2);
        }
      });
    },
    // 审核新闻
    auditNews(id, status) {
      this.axios({
        method: "POST",
        url:"/api/audit/auditNews",
        data: {
          id: id,
          status:status
        }
      }).then(res => { 
        console.log(res);
        if (res.data.code===200) {
          this.$message({
            type: 'success',
            message: '操作成功'
          });
        }
        else {
          this.$message({
            type: 'warning',
            message: res.data.msg
          });
        }
        this.getNewsList();
      }).catch(err => { 
        console.log(err);
      })
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.$router.push("/detail/"+row.id)
        
      },
    handleDelete(index, row) {
        console.log(index, row);
        this.axios({
            method: "DELETE",
            url:"/api/news/DeleteNews?newsId="+this.newsList[index].newsId
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
        url:`/api/audit/newsList?current=${this.current}&&size=${this.size}`
      }).then(res => { 
        console.log(res);
        this.newsList = res.data.data.records;
        // this.total=res.data.data.total
      }).catch(err => { 
        console.log(err);
      })
    },
    // 选择器
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
