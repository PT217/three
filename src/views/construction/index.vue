
<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab :title="title" :tabShow="false" :pageShow="false">
      <div class="boxList">
        <div class="contentBox" v-for="(item, i) in pathList" :key="item.path">
          <div class="box">
            <div class="left">
              <div class="first">{{ item.h4 }}</div>
              <div class="two">{{ item.p }}</div>
              <div class="three">
                <el-button @click="$router.push({ path: item.path })">点击进入</el-button>
              </div>
            </div>
            <div>
              <img :src="require(`../../assets/common/${i + 1}.png`)" />
            </div>
          </div>
          <!-- <div class="arrow" v-if="idx != pathList.length - 1">
            <img src="../../assets/rightArrow.png" alt="" />
          </div> -->
        </div>
      </div>
    </Tab>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
export default {
  components: {
    Tab,
    Nav,
  },
  data() {
    return {
      title: "施工管理",
      nav: [
        {
          name: "施工管理",
          path: "/construction",
          isClick: false,
        },
      ],
      pathList: [
        {
          h4: "施工进度管理",
          p: "施工进度列表，可查看日报周报月报等信息。",
          path: "/proSchedule",
        },
      ],
    };
  },
};
</script>

<style lang='less' scoped>
.boxList {
  display: flex;
  flex-wrap: wrap;

  .contentBox {
    width: 23%;
    margin-left: 20px;
    margin-top: 30px;
    height: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .box {
      width: 80%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #dddddd;
      padding: 10px;
      box-sizing: border-box;
      position: relative;

      .left {
        margin-left: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 90%;

        .first {
          height: 10%;
          color: #333333;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .two {
          color: #777777;
          font-size: 14px;
          margin-bottom: 10px;
          height: 40%;
          overflow: auto;
        }

        .three {
          height: 20%;
        }
      }
    }

    .arrow {
      width: 15%;

      img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
</style>