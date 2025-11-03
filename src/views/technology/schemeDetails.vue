<template>
  <div>
    <Nav :nav="nav"></Nav>
    <!-- 方案明细详细列表 -->
    <div class="box">
      <div style="padding: 43px 100px">
        <table border="1" cellspacing="0" cellpadding="0" width="100%" style="
            border-collapse: collapse;
            border: 1px solid #999;
            font-size: 14px;
            margin-bottom: 37px;
          " class="schemeDetails" v-for="(detailsItem, detailsIndex) in schemeDetailsData" :key="detailsIndex">
          <tr v-if="detailsIndex == 0" style="font-size: 20px">
            <th colspan="9" style="padding: 8px">方案明细详细列表</th>
          </tr>

          <tr>
            <th style="padding: 8px; width: 180px">工程类别</th>
            <th style="padding: 8px; width: 180px" colspan="2">活动项</th>
            <th style="padding: 8px; width: 180px">工艺</th>
            <th style="padding: 8px; width: 180px" colspan="4">
              采购总价（元）
            </th>
            <th style="padding: 8px; width: 180px">周期（周）</th>
          </tr>
          <tr align="left">
            <td style="padding: 8px">
              {{ detailsItem.itemTreeVo.itemTreeVo.itemTreeVo.catelogName }}
            </td>
            <td colspan="2">
              {{ detailsItem.itemTreeVo.itemTreeVo.catelogName }}
            </td>
            <td>{{ detailsItem.itemTreeVo.catelogName }}</td>
            <td colspan="4">{{ detailsItem.subentryCost }}</td>
            <td>{{ detailsItem.weekNums }}</td>
          </tr>
          <tr>
            <th style="padding: 8px; width: 180px">费用类别</th>
            <th style="padding: 8px; width: 180px">成本名称</th>
            <th style="padding: 8px; width: 180px">成本子项</th>
            <th style="padding: 8px; width: 180px">规格</th>
            <th style="padding: 8px; width: 180px">单位</th>
            <th style="padding: 8px; width: 180px">数量</th>
            <th style="padding: 8px; width: 180px">单价（元）</th>
            <th style="padding: 8px; width: 180px">合价（元）</th>
            <th style="padding: 8px; width: 180px">备注</th>
          </tr>
          <tr align="left" v-for="(item, index) in detailsItem.itemPayPlanVos" :key="index">
            <td style="padding: 8px">{{ item.costGroupName }}</td>
            <td>{{ item.costName }}</td>
            <td></td>
            <td></td>
            <td>{{ item.costUnit }}</td>
            <td>{{ item.amount }}</td>
            <td>{{ item.payPrice }}</td>
            <td>{{ item.payTotal }}</td>
            <td>{{ item.payNote }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import { techConductFindPlan } from "../../utils/api";
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
          name: "方案报表",
          path: "/allTable",
          isClick: false,
        },
      ],
      schemeDetailsData: [],
    };
  },
  created() {
    this.techConductFindPlan();
  },
  methods: {
    // 获取数据
    async techConductFindPlan() {
      const res = await techConductFindPlan({
        structureId: localStorage.getItem(
          "structureId"
        ),
      });
      if (res) {
        this.schemeDetailsData = res.data.data;
      }
    },
  },
};
</script>

<style scoped>
.box {
  height: calc(100% - 90px);
  overflow: auto;
  background-color: white;
}
</style>
