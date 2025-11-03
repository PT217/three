<template>
  <div class="box">
    <div class="header">
      <div class="labelwrap">
        <p>天空盒</p>
        <img src="@/assets/data/titleActive.png" alt="" />
      </div>
    </div>

    <div class="content">
      <el-radio v-for="item in skyList" v-model="$store.state.skyValue" :key="item.value" :label="item.value" border
        @change="e => $store.commit('setSkyValue', e)">{{ item.key
        }}</el-radio>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {

      skyList: [
        {
          key: '白昼',
          value: "white",
        },
        {
          key: '黑夜',
          value: "night",

        },
      ],
      value: 'white'
    };


  },
  components: {},
  created() { },
  mounted() {

  },
  methods: {
    change(e) {
      console.log(e);
    }

  },
}
</script>

<style lang='less' scoped>
.box {
  height: 100%;
  // width: 400px;
  min-width: 367px;
  min-height: 400px;
  z-index: 2;
  position: relative;

  .header {
    background: url("@/assets/data/modelHeaderBG.png") center no-repeat;
    background-size: 100% 100%;
    width: 100%;
    height: 40px;
    position: absolute;
    top: -40px;
    // border: 1px solid black;


    .labelwrap {
      // border: 1px solid black;
      position: absolute;
      left: 93px;
      height: 100%;
      // top: 13px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      // text-align: center;

      p {
        // border: 1px solid black;
        font-size: 18px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        // margin-top: -5px;
        // margin-bottom: 5px;
      }

      img {
        width: 29px;
        height: 6px;
        position: relative;
        left: 0;
        right: 0;
        margin: 0px auto;
      }
    }
  }

  .content {
    padding-top: 50px;
    display: flex;
    justify-content: center;
  }




}
</style>