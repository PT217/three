<template>
  <div id="app">
    <Header />
    <keep-alive v-if="$route.meta.keepAlive && isRouterAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"> </router-view>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
export default {
  name: "App",
  components: {
    Header,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },

  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang='less'>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
  // overflow: hidden;
}



/* 添加Edge浏览器特定的样式 */
#app {
  font-family: MiSans-Regular !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-width: 1400px;
  height: 100vh;
  width: 100vw;


  >div:nth-of-type(2) {
    background-color: #DADDE2;
    height: calc(100% - 60px);
    display: flex;
    flex-direction: column;
  }
}



:deep(.el-message) {
  top: 20% !important
}



.el-button,
.gantt_tooltip,
.el-select-dropdown,
.el-picker-panel,
.el-tooltip__popper,
.el-loading-mask {
  font-family: MiSans-Regular !important;

  button {
    font-family: MiSans-Regular
  }
}


.el-input .el-input__inner,
.el-textarea__inner {
  font-family: MiSans-Regular;
}

.el-select {
  width: 100%;
}

.el-dialog__header {

  .el-dialog__title {
    color: #333333;
    font-size: 18px;
    margin-left: 15px;
  }
}

.el-drawer__header {
  height: 40px;
  line-height: 40px;
  padding: 0;
  margin: 0;
  margin-left: 15px;
  color: #333333;
  font-size: 18px;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 5px;
  height: 0px;
  position: absolute;
}

::-webkit-scrollbar-thumb {
  background-color: #1890ff;
}

::-webkit-scrollbar-track {
  background-color: #ddd;
}
</style>