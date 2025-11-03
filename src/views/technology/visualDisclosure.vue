<template>
  <div class="permit">
    <Nav :nav="nav"></Nav>

    <Tab title="可视化交底" :tabShow="false">
      <div class="boxList">
        <div
          class="contentBox"
          v-for="(item, idx) in pathList"
          :key="item.path"
        >
          <div class="box">
            <div>
              <h4>{{ item.h4 }}</h4>
              <p>{{ item.p }}</p>
              <el-button @click="$router.push({ path: item.path })"
                >点击进入</el-button
              >
            </div>
            <div>
              <img :src="require(`../../assets/technology/${item.img}`)" />
            </div>
          </div>
          <div class="arrow" v-if="idx != pathList.length - 1">
            <img src="../../assets/share/rjt.png" alt="" />
          </div>
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
      nav: [
        {
          name: "可视化交底",
          path: "/可视化交底",
          isClick: false,
        },
      ],
      pathList: [
        {
          h4: "文档可视化交底",
          p: "文档可视化交底管理",
          path: "/projectPersonnel",
          img: "wdkshjd.png",
        },
        {
          h4: "视频可视化交底",
          p: "视频可视化交底管理",
          path: "/projectPersonnel",
          img: "spkshjd.png",
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
      div {
        width: 50%;
        .el-button {
          position: absolute;
          bottom: 10px;
        }
        h4 {
          position: absolute;
          top: 30px;
        }
        p {
          font-size: 12px;
        }
        img {
          width: 80%;
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