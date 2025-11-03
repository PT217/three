<template>
  <div class="flowChart">
    <Nav :nav="nav">
      <template slot="right">
        <el-button v-show="editRoadmap" type="primary" size="mini"
          @click.prevent="handleBackRoadmap()">返回编辑内容及方案</el-button>
        <el-button type="primary" size="mini" @click.prevent="flowChartBack" v-show="editRoadmap == false">返回</el-button>
        <el-button type="primary" size="mini" @click.prevent="techItem_payGetSchemePrice">生成可视化报表</el-button>
      </template>
    </Nav>

    <Tab :tabShow="false" :title="title" :pageShow="false">
      <X6 />
    </Tab>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import Tab from "../../components/Tab";
import X6 from "../../components/X6.vue";
import { techItem_payGetSchemePrice } from "../../utils/api";
export default {
  components: {
    Nav,
    X6,
    Tab,
  },
  data() {
    return {
      title: "方案设计",
      nav: [
        {
          name: "技术管理",
          path: "/technology",
          isClick: false,
        },
        {
          name: "工程结构分解",
          path: "/proDecompose",
          isClick: false,
        },
        {
          name: "设计",
          path: "/flowChart",
          isClick: false,
        },
      ],
      structureId: localStorage.getItem(
        "structureId"
      ),
      // 技术路线标识
      editRoadmap: "",
    };
  },
  created() {
    if (this.$route.params.data == "roadmap") {
      this.editRoadmap = true;

      //取出工程分解id，查询设计
      this.structureId = localStorage.getItem(
        "structureId"
      );
    }
  },
  mounted() { },
  methods: {
    async techItem_payGetSchemePrice() {
      const res = await techItem_payGetSchemePrice({
        structureId: this.structureId,
      });
      console.log(res);
      if (res) {
        if (res.data.data == 0) {
          this.$message({
            offset: 170,
            duration: "1000",
            message: "您还未在方案内保存费用",
            type: "error",
          })
        } else {
          this.$router.push({
            path: "/visualShow",
          });
        }
      }
    },
    // 返回
    flowChartBack() {
      this.$router.push({
        path: "/proDecompose",
      });
    },
    // 返回技术路线页面
    handleBackRoadmap() {
      this.$router.push({
        name: "proposalText",
        params: { data: "editRoadmap" },
      });
    },
  },
};
</script>

<style scoped>
.flowChart :deep(.x6-vue-wrap) {
  position: relative;
}
</style>
