<!--
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-08-18 10:03:20
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2022-10-26 17:08:49
 * @FilePath: /4-27/chengwei/src/views/technology/technology.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="permit">
    <Nav :nav="nav"></Nav>

    <Tab title="技术管理" :tabShow="false" :pageShow="false">
      <div class="boxList">

        <div class="contentBox" v-for="(item, i) in  pathList " :key="item.path">

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

          <div class="arrow" v-if="((i + 1) % 4) && i != pathList.length - 1">
            <img src="../../assets/common/rjt.png" alt="" />
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
          name: "技术管理",
          path: "/technology",
          isClick: false,
        },
      ],
      pathList: [
        {
          h4: "特性调查数据",
          p: "退役设施调查所获得的辐射物质和环境影响等方面的数据。",
          path: "/characteristic",
        },
        {
          h4: "工程结构分解",
          p: "退役项目分解为更小、更具体的退役活动单元数据。",
          path: "/proDecompose",
        },
        {
          h4: "项目建议书",
          p: "项目建议书列出关于退役项目的可行性和预期成果等。",
          path: "/proposal",
        },
        {
          h4: "代实施方案",
          p: "代实施方案列出实施退役的各种需求。",
          path: "/programme",
        },

        {
          h4: "知识信息管理",
          p: "知识信息管理涵盖了核设施退役相关的知识信息数据。",
          path: "/knowledge",
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