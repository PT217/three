
<!--  -->
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
      title: "退役申报基本参数管理",
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "退役申报基本参数管理",
          path: "/retirementDeclaration",
          isClick: false,
        },
      ],
      pathList: [
        {
          h4: "工作流目录",
          p: "工作流目录数据的展示和管理",
          path: "/workflow",
        },
        {
          h4: "退役成本",
          p: "退役成本数据的展示和管理",
          path: "/retireCost",
        },
        {
          h4: "退役报表",
          p: "退役报表数据的展示和管理",
          path: "/parameter",
        },
        {
          h4: "人工费",
          p: "人工费数据的展示和管理",
          path: "/laborCost",
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