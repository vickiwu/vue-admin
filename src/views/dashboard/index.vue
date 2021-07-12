<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name: {{ name }}</div>
    <div class="dashboard-text">roles: <span v-for="role in roles" :key="role">{{ role }}</span></div>
    <span v-permission="['admin']" class="permission-alert">
      Only
      <el-tag class="permission-tag" size="small">admin</el-tag> can see this
    </span>
  </div>
</template>

<script>
import permission from '@/directive/permission/index.js' // 权限判断指令
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  directives: { permission },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
