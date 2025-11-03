<template>
  <div class="container" id="root_header_container">
    <div class="titleWrap">WEB轻量化模型仿真系统</div>
    <div class="exporterWrap">
      <div class="timeWrap"></div>
      <div class="button" @click="$router.push({ path: '/sceneData' })">
        返回
      </div>
    </div>

  </div>
</template>

<script>

export default {
  data() {
    return {
      timer: null
    }
  },

  mounted() {
    this.time_header()
  },

  destroyed() {
    clearInterval(this.timer)
  },

  methods: {
    time_header() {
      // 先执行一次
      // 获取当前系统时间
      var now = new Date();
      var d1 = now.toLocaleString();
      document.getElementsByClassName("timeWrap")[0].innerHTML = d1;

      //定时
      this.timer = setInterval(() => {
        // 获取当前系统时间
        var now = new Date();
        var d1 = now.toLocaleString();
        document.getElementsByClassName("timeWrap")[0].innerHTML = d1;
      }, 1000);
    },
  },
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  min-width: 1500px;
  height: 80px;
  background: url("@/assets/data/headerBG.png") center no-repeat;
  // background-color: #000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  z-index: 2;


  .titleWrap {
    width: 30%;
    height: 100%;
    // line-height: 79px;
    // background: #fff;
    padding: 30px 0px 25px 111px;
    font-size: 24px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }



  .exporterWrap {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 47px 41px 11px 0px;

    .timeWrap {
      padding-right: 10px;
      text-align: center;
      font-size: 24px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
    }

    .button {
      width: 102px;
      height: 24px;
      display: flex;
      justify-content: center;
      align-items: center;

      color: #ffffff;

      background: url("@/assets/data/but-normal.png") center no-repeat;
      background-size: 100% 100%;

      &:hover {
        background: url("@/assets/data/but-hover.png") center no-repeat;
        background-size: 100% 100%;
      }


      img {
        width: 57px;
        height: 17px;
      }
    }
  }
}
</style>
