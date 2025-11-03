<!--
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-08-18 15:08:25
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2022-10-26 16:22:34
 * @FilePath: /4-27/chengwei/src/views/project/index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="项目管理" :tabShow="false" :pageShow="false">
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
import Nav from "../../components/Nav";
import Tab from "../../components/Tab";
export default {
  components: {
    Nav,
    Tab,
  },
  data() {
    return {
      title: "项目管理",
      nav: [
        {
          name: "项目管理",
          path: "/project",
          isClick: false,
        },
      ],
      pathList: [
        {
          h4: "核退役设施",
          p: "核退役设施列表。",
          path: "/ndpProManage",
        },
        {
          h4: "核退役项目",
          p: "核退役项目列表。",
          path: "/ndpChildManage",
        },
        {
          h4: "任务管理",
          p: "任务列表。",
          path: "/taskManage",
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
  }
}
</style>