<template>
  <div class="aside">
    <el-row class="tac">
      <el-col >
    <el-menu
      default-active="1-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-document-copy"></i>
          <span>发布者管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/auditorslist">
            <el-menu-item index="1-1">
            发布申请
            </el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>用户账号管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/userslist">
            <el-menu-item index="2-1">
                用户列表
            </el-menu-item>
          </router-link>
          <!-- <router-link to="/admin/banlist">
            <el-menu-item index="2-2">
                封禁用户列表
            </el-menu-item>
          </router-link> -->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-fold"></i>
          <span>栏目管理</span>
        </template>
        <el-menu-item-group>
          <router-link to="/admin/column">
            <el-menu-item index="3-1">
              栏目列表
            </el-menu-item>
          </router-link>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-col>
    </el-row>
  
  </div>
</template>

<script>
export default {
  name: 'Aside',
  data () {
    return {
     
    }
  },
  methods: {
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      }
    }
}
</script>

<style scoped>

</style>
