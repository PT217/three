<template >
  <!-- 分部分项工程清单与计价表 -->
  <div>
    <Nav :nav="nav">
      <template slot="right">
        <el-button type="primary" size="mini" @click.prevent="handleBack()">返回</el-button>
        <el-button type="primary" size="mini" @click.prevent="handlePrintTable()">导出</el-button>
      </template>
    </Nav>
    <div class="box">
      <table border="1" cellspacing="0" cellpadding="0" width="100%" id="handlePrintTable" style="
          border-collapse: collapse;
          border: 1px solid #999;
          font-size: 14px;
          margin-bottom: 37px;
        " v-for="(item, i) in tableData" :key="i">
        <tr v-if="i == 0" style="font-size: 20px">
          <th colspan="4" style="padding: 8px">分部分项工程清单与计价表</th>
        </tr>

        <tr>
          <th style="padding: 8px">工程名称</th>
          <td align="left" style="padding: 8px" colspan="3">
            {{ name }}
          </td>
        </tr>
        <tr align="left">
          <th style="padding: 8px">工程类型</th>
          <th>活动项</th>
          <th>工艺</th>
          <th>金额（总价（元））</th>
        </tr>
        <tr align="left">
          <td style="padding: 8px; width: 25%">{{ item.parent1Name }}</td>
          <td style="padding: 8px; width: 25%">{{ item.parent2Name }}</td>
          <td style="padding: 8px; width: 25%">{{ item.parent3Name }}</td>
          <td style="padding: 8px; width: 25%">{{ item.cost }}</td>
        </tr>
        <tr align="left">
          <th style="padding: 8px">项目编码</th>
          <th style="padding: 8px">项目名称</th>
          <th style="padding: 8px">项目特征描述</th>
          <th style="padding: 8px">金额（合价（元））</th>
        </tr>

        <tr align="left" v-for="(p, index) in item.subentryVoList" :key="index">
          <td style="padding: 8px">{{ p.proCode }}</td>
          <td style="padding: 8px">{{ p.proName }}</td>
          <td style="padding: 8px">{{ p.proDesc }}</td>
          <td style="padding: 8px">{{ p.cost }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import { findStatement2Partial } from "../../utils/api";
export default {
  components: {
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
          name: "分部分项工程清单与计价表",
          path: "/subItemTable",
          isClick: false,
        },
      ],
      tableData: [],
      name: "",
    };
  },
  created() {
    this.findStatement2Partial();
  },
  methods: {
    //表格数据
    async findStatement2Partial() {
      const res = await findStatement2Partial({
        structureId: localStorage.getItem(
          "structureId"
        ),
      });
      this.name = localStorage.getItem("buildName");
      if (res) this.tableData = res.data.data.schemeStatementVo;
    },
    // 返回
    handleBack() {
      this.$router.push({ path: "/allTable" });
    },
    // 单个打印
    handlePrintTable() {
      let html = document.getElementById("handlePrintTable").outerHTML;
      var excelHtml =
        '<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:WorksheetOptions><x:Print><x:ValidPrinterInfo /></x:Print></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml></head><style>table{vnd.ms-excel.numberformat:@;}</style>' +
        html +
        "</html>";
      // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
      var blob = new Blob([excelHtml], { type: "application/vnd.ms-excel" });
      let url = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute(
        "download",
        `${localStorage.getItem("buildName")}.xls`
      );
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>

<style scoped>
.box {
  padding: 43px 100px;
  height: calc(100% - 90px);
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 0px 3px 6px rgba(48, 116, 237, 0.1);
  overflow: auto;
}
</style>