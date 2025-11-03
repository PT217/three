<template>
  <div class="box">
    <div class="header">
      <div class="labelwrap">
        <p>图标库</p>
        <img src="@/assets/data/titleActive.png" alt="" />
      </div>
    </div>

    <div class="content">
      <div v-for="item in iconList" class="child" :key="item.name">
        <div>
          <img :ref="item.name" :src="require(`../../../public/images/${item.icon}.png`)" draggable />
        </div>
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {

      iconList: [
        {
          name: '知识标',
          icon: "cjsb",
          type: 'zsb'
        },
        {
          name: '摄像标',
          icon: "cjsxt",
          type: 'sxb',

        },
      ],
    };
  },
  components: {},
  created() { },
  mounted() {
    this.iconList.forEach(item => {
      this.$refs[item.name][0].addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('icon', JSON.stringify(item));
      });
    });
  },
  methods: {


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
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-content: flex-start;
    flex-wrap: wrap;
    overflow: auto;
    background-color: #0c1d3c;



    .child {
      // background-color: transparent;
      margin-left: 1px;
      margin-top: 1px;
      width: 180px;
      height: 200px;
      background-color: #324870;

      >div:nth-child(1) {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 180px;
        height: 180px;
        background-color: #314D78;
      }

      >div:nth-child(2) {
        position: relative;
        height: 20px;
        text-align: center;
        line-height: 20px;
        font-family: sans-serif;
        font-size: large;
        color: white;
        background-color: #23385A;
        font-size: 14px;
      }

    }
  }



}
</style>