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
      title: "数据管理",
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
      ],
      pathList: [
        {
          h4: "模型库管理",
          p: "模型库数据信息管理列表。",
          path: "/model",
        },
        {
          h4: "多媒体库管理",
          p: "多媒体库数据信息管理列表。",
          path: "/media",
        },
        {
          h4: "废物库管理",
          p: "废物库数据信息管理列表。",
          path: "/waste",
        },
        {
          h4: "退役申报基本参数管理",
          p: "基本参数表存放的是主要业务的基础数据。",
          path: "/retirementDeclaration",
        },
        {
          h4: "项目人员管理",
          p: "人员管理包含相关人员信息，以及对人员权限进行管控。",
          path: "/projectPersonnel",
        },
        {
          h4: "操作日志",
          p: "日志记录所有用户执行的操作，用于定位分析故障问题。",
          path: "/operateLog",
        },

        {
          h4: "知识索引管理",
          p: "知识分类及标签管理列表。",
          path: "/knowledgeCategory",
        },
        {
          h4: "场景数据管理",
          p: "通过整合三维场景、监控设备，知识绑定，进行管理。",
          path: "/sceneData",
        },
        {
          h4: "摄像头管理",
          p: "摄像头管理。",
          path: "/camera",
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