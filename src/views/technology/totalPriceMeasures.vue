<template>
  <!-- 总价措施项目清单计划表 -->
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
          <th colspan="6" style="padding: 8px">总价措施项目清单计价表</th>
        </tr>
        <tr align="left">
          <th style="padding: 8px">工程名称</th>
          <td align="left" colspan="5">
            {{ name }}
          </td>
        </tr>
        <tr align="left">
          <th width="16%" style="padding: 8px">序号</th>
          <th width="20%">项目名称</th>
          <th width="16%">计算基础</th>
          <th width="16%">计算基数</th>
          <th width="16%">费率(%)</th>
          <th width="16%">金额(元)</th>
        </tr>
        <tr align="left" v-for="(item, i) in tableData" :key="i">
          <td style="padding: 8px">{{ item.paramCode }}</td>
          <td>{{ item.note }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.cardinalNumber }}</td>
          <td>{{ item.payCoefficient }}</td>
          <td>{{ item.cost }}</td>
        </tr>
        <tr align="left">
          <td style="padding: 8px" colspan="5">合计（元）</td>
          <td>{{ allCost }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import { findItemPay2MeasureCost } from "../../utils/api";
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
          name: "总价措施项目清单计价表",
          path: "/totalPriceMeasures",
          isClick: false,
        },
      ],
      tableData: [],
      name: "",
      allCost: "",
    };
  },
  created() {
    this.findItemPay2MeasureCost();
  },
  methods: {
    async findItemPay2MeasureCost() {
      const res = await findItemPay2MeasureCost({
        structureId: localStorage.getItem(
          "structureId"
        ),
      });
      this.name = localStorage.getItem("buildName");
      if (res) {
        this.allCost = res.data.data.allCost;
        this.tableData = res.data.data.paramVoList;
      }
    },
    // 返回
    handleBack() {
      this.$router.push({ path: "/allTable" });
    },
    // 单个打印
    handlePrintTable() {
      let html = document.getElementById("handlePrintTable").outerHTML;
      // debugger;

      // 使用outerHTML属性获取整个table元素的HTML代码（包括<table>标签），然后包装成一个完整的HTML文档，设置charset为urf-8以防止中文乱码
      //  var html = "<html><head><meta charset='utf-8' />"+""+"</head><body>" + table.outerHTML + "</body></html>";
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