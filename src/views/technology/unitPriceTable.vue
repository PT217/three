<template>
  <!-- 综合单价报表分析 -->
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
        " v-for="(tableItem, index) in tableData.conductContentVoList">
        <tr style="font-size: 20px">
          <th v-if="index == 0" colspan="7" style="padding: 8px">
            综合单价报表分析
          </th>
        </tr>
        <tr>
          <th style="padding: 8px">工程名称</th>
          <td align="left" colspan="6">
            {{ name }}
          </td>
        </tr>
        <tr align="left">
          <th style="padding: 8px">项目编码</th>
          <td colspan="2">{{ tableItem.subitemCode }}</td>
          <th colspan="2">项目名称</th>
          <td colspan="2">{{ tableItem.subitemName }}</td>
        </tr>
        <tr>
          <th style="padding: 8px" colspan="7">清单综合单价组成明细</th>
        </tr>
        <tr>
          <th style="padding: 8px" colspan="7">合价</th>
        </tr>
        <tr>
          <th style="padding: 8px" width="14%">治理费</th>
          <th width="14%">工程费</th>
          <th width="14%">材料费</th>
          <th width="14%">人工费</th>
          <th width="14%">设备费</th>
          <th width="14%">工程其他费</th>
          <th width="14%">总价（元）</th>
        </tr>
        <!-- TODO获取数据循环 -->
        <tr align="left">
          <td style="padding: 8px">{{ tableItem.groupCostMap.治理费 }}</td>
          <td>{{ tableItem.groupCostMap.工程费 }}</td>
          <td>{{ tableItem.groupCostMap.材料费 }}</td>
          <td>{{ tableItem.groupCostMap.人工费 }}</td>
          <td>{{ tableItem.groupCostMap.设备费 }}</td>
          <td>{{ tableItem.groupCostMap.工程其他费 }}</td>
          <td>{{ tableItem.groupCostMap.总价 }}</td>
        </tr>
        <tr>
          <th style="padding: 8px" colspan="7">清单综合单价组成明细</th>
        </tr>
        <tr align="left">
          <!-- TODO这个地方看下是包括了多少行 -->
          <th style="padding: 8px" :rowspan="tableItem.itemPayList.length + 1">
            材料费用明细
          </th>
          <th colspan="2" style="padding: 8px">组要材料名称、规格、型号</th>
          <th>单位</th>
          <th>数量</th>
          <th>单价(元)</th>
          <th>合价(元)</th>
        </tr>
        <!-- TODO填写数据 -->
        <tr align="left" v-for="(data, j) in tableItem.itemPayList" :key="j">
          <td style="padding: 8px" colspan="2">{{ data.payName }}</td>
          <td>{{ data.costUnit }}</td>
          <td>{{ data.amount }}</td>
          <td>{{ data.payPrice }}</td>
          <td>{{ data.payTotal }}</td>
        </tr>
        <tr>
          <td style="padding: 18.5px"></td>
          <td colspan="2"></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import { getCompreUnitPrice } from "../../utils/api";
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
          name: "综合单价报表分析表",
          path: "/unitPriceTable",
          isClick: false,
        },
      ],
      tableData: [],
      name: "",
    };
  },
  created() {
    this.getCompreUnitPrice();
  },
  methods: {
    async getCompreUnitPrice() {
      const res = await getCompreUnitPrice({
        structureId: localStorage.getItem(
          "structureId"
        ),
      });
      this.name = localStorage.getItem("buildName");
      if (res) this.tableData = res.data.data;
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