<!--
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-09-10 18:10:31
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2022-09-10 18:14:48
 * @FilePath: /NDP/chengwei/src/components/Index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="error-page">
    <div class="error-code">
      4
      <span>0</span>
      4
    </div>
    <div class="error-desc">您访问的页面不存在或没有权限</div>
    <div class="error-handle">
      <router-link to="/home">
        <el-button type="primary" size="large">返回首页</el-button>
      </router-link>
      <el-button
        class="error-btn"
        type="primary"
        size="large"
        @click="handleBack"
        >返回上一页</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: #f3f3f3;
  box-sizing: border-box;
}
.error-code {
  line-height: 1;
  font-size: 250px;
  font-weight: bolder;
  color: #2d8cf0;
}
.error-code span {
  color: #00a854;
}
.error-desc {
  font-size: 30px;
  color: #777;
}
.error-handle {
  margin-top: 30px;
  padding-bottom: 200px;
}
.error-btn {
  margin-left: 100px;
}
</style>
