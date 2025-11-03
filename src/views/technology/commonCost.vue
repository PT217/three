<template>
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
        ">
        <tr style="font-size: 20px">
          <th colspan="6" style="padding: 8px">规费、税金项目计价表</th>
        </tr>
        <tr>
          <th style="padding: 8px">工程名称</th>
          <td align="left" colspan="5" style="padding: 8px">
            {{ name }}
          </td>
        </tr>
        <tr>
          <th width="10%" style="padding: 8px 0">序号</th>
          <th width="16%">项目名称</th>
          <th width="30%">计算基础</th>
          <th width="10%">计算基数</th>
          <th width="10%">计算费率(%)</th>
          <th width="10%">金额（元）</th>
        </tr>
        <tr align="left" v-for="(item, i) in tableData" :key="i">
          <td>{{ item.paramCode }}</td>
          <td>{{ item.note }}</td>
          <td align="left" style="padding: 8px">{{ item.description }}</td>
          <td>{{ item.cardinalNumber }}</td>
          <td>{{ item.payCoefficient }}</td>
          <td>{{ item.cost }}</td>
        </tr>
        <tr align="left">
          <td align="left" style="padding: 8px" colspan="5">合计（元）</td>
          <td>{{ allCost }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import { getItemPay2LaborCost } from "../../utils/api";
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
          name: "规费、税金项目计价表",
          path: "/commonCost",
          isClick: false,
        },
      ],
      tableData: [],
      allCost: "",
      name: "",
    };
  },
  created() {
    this.getItemPay2LaborCost();
  },
  methods: {
    async getItemPay2LaborCost() {
      const res = await getItemPay2LaborCost({
        structureId: localStorage.getItem(
          "structureId"
        ),
      });
      this.name = localStorage.getItem("buildName");
      if (res) {
        this.tableData = res.data.data.paramVoList;
        this.allCost = res.data.data.allCost;
      }
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