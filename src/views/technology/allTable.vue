<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab :tabShow="false" title="方案报表明细">
      <el-table border :data="tableData" :show-header="false" style="width: 100%">
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="text" style="padding-left: 10px" @click="goTab(scope)">
              {{ scope.row.name }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
        {
          name: "可视化图表",
          path: "/visualShow",
          isClick: false,
        },
        {
          name: "方案明细",
          path: "/schemeDetails",
          isClick: false,
        },
        {
          name: "方案报表",
          path: "/allTable",
          isClick: false,
        },
      ],
      tableData: [
        { name: "费用汇总表", path: "/costAggregation" },
        { name: "分部分项工程清单与计价表", path: "/subItemTable" },
        { name: "综合单价报表分析表", path: "/unitPriceTable" },
        {
          name: "总价措施项目清单计价表",
          path: "/totalPriceMeasures",
        },
        { name: "规费税金项目计价表", path: "/commonCost" },
      ],
    };
  },
  methods: {
    goTab(scope) {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      setTimeout(() => {
        loading.close();
        this.$router.push({
          path: scope.row.path,
        });
      }, 1000);
    },
  },
};
</script>
