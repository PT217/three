<template>
  <div>
    <Nav :nav="nav"></Nav>
    <!-- 创建图表容器 -->
    <div id="box">

      <div>
        <div class="title">
          <div class="icon"></div>直接费用分项成本示意图
        </div>
        <div ref="bar" class="bbb"></div>
      </div>

      <div>
        <div class="title">
          <div class="icon"></div>直接费用分部成本示意图
        </div>
        <div ref="donut"></div>
      </div>

      <div id="c3">
        <div class="title">
          <div class="icon"></div>直接费用成本估算分布图
        </div>
        <div ref="line"></div>
      </div>

    </div>
  </div>
</template>
<script>
import Nav from "../../components/Nav.vue";
import {
  // 请求条形图数据 structureId 29
  techItem_payGetItemPay2Bar,
  // 请求半圆图数据
  techItem_payGetItemPay2Pie,
  // 请求折线图数据 structureI
  techItem_payGetItemPay2Line,
  // 请求方案下的所有分类费用数据之和
  techItem_payGetSchemePrice

} from '../../utils/api'

import c3 from 'c3';
import 'c3/c3.css';
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

      // 条形图
      barChart: {},
      barData: {
        columns: [],
        type: 'bar',
        groups: [
          ['人工费', '工程其他费', '工程费', '材料费', '治理费', '设备费']
        ],
        labels: true,
        colors: {
          人工费: '#5b9df8',
          工程其他费: '#75c87c',
          工程费: '#f3d35f',
          材料费: '#445084',
          治理费: '#8e61dd',
          设备费: '#6dc7ca'
        },
      },

      // 甜甜圈
      title: "",
      donutChart: {},
      donutData: {
        columns: [],
        type: 'donut',
      },

      // 折线
      lineChart: {},
      lineData: {
        x: 'x',
        columns: [
          ['x'],
          ['成本费用']
        ],
        types: {
          成本费用: 'line',
          data2: 'line'
        },

      },

    };
  },


  created() {
    this.requestFn()
  },
  mounted() {
    this.init()
    window.addEventListener('resize', this.init);

  },
  beforeDestroy() {
    if (this.barChart) this.barChart.destroy()
    if (this.donutChart) this.donutChart.destroy()
    if (this.lineChart) this.lineChart.destroy()
  },
  methods: {
    async requestFn() {
      console.log(4);
      const res1 = await techItem_payGetItemPay2Bar({ structureId: localStorage.getItem('structureId') })
      const res2 = await techItem_payGetItemPay2Pie({ structureId: localStorage.getItem('structureId') })
      const res3 = await techItem_payGetItemPay2Line({ structureId: localStorage.getItem('structureId') })
      const res = await techItem_payGetSchemePrice({ structureId: localStorage.getItem('structureId') })
      if (res1) {
        console.log(this.barData.columns[0]);
        res1.data.data.map((item) => {
          if (item.costGroupName == '人工费') this.barData.columns[0] = ['人工费', item.payTotalForGroup, null, null, null, null, null]
          if (item.costGroupName == '工程其他费') this.barData.columns[1] = ['工程其他费', null, item.payTotalForGroup, null, null, null, null]
          if (item.costGroupName == '工程费') this.barData.columns[2] = ['工程费', null, null, item.payTotalForGroup, null, null, null]
          if (item.costGroupName == '材料费') this.barData.columns[3] = ['材料费', null, null, null, item.payTotalForGroup, null, null]
          if (item.costGroupName == '治理费') this.barData.columns[4] = ['治理费', null, null, null, null, item.payTotalForGroup, null]
          if (item.costGroupName == '设备费') this.barData.columns[5] = ['设备费', null, null, null, null, null, item.payTotalForGroup]
        })

        console.log(this.barData.columns);
      }

      if (res2) this.donutData.columns = res2.data.data.map((item, index) => [item.treeName, item.cost])

      if (res) this.title = '总计:' + res.data.data + '元'

      if (res3) {
        res3.data.data.map(item => {
          if (item) {
            this.lineData.columns[0].push(item.startTime)
            this.lineData.columns[1].push(item.costPerWeek)
          }
        })
      }
    },


    init() {
      console.log('chufa');
      setTimeout(() => {
        this.barChartFn()

        this.donutChartFn()

        this.lineChartFn();
      }, 500)
    },


    // 条形图
    barChartFn() {
      this.barChart = c3.generate({
        bindto: this.$refs.bar,
        data: this.barData,
        bar: {
          width: {
            ratio: 0.5 // 调整柱状图之间的间隔，比例越小间隔越大
          }
        },
        axis: {
          x: {
            type: 'category',
            categories: ['人工费', '工程其他费', '工程费', '材料费', '治理费', '设备费'] // 设置 x 轴类别
          },
          y: {
            label: {
              text: '单位(元)',
              position: 'outer-middle'
            }
          }
        },
        padding: {
          top: 10, // 顶部偏移量
          right: 30, // 右侧偏移量
          bottom: 5, // 底部偏移量
          left: 110 // 左侧偏移量
        }
      });
    },


    // 甜甜圈
    donutChartFn() {
      let that = this
      this.donutChart = c3.generate({
        bindto: this.$refs.donut,
        data: this.donutData,

        donut: {
          title: that.title,
          label: {
            format: value => value + '元'
          }
        },
        tooltip: {
          format: {
            value: value => value + '元'
          }
        },
        padding: {
          top: 10, // 顶部偏移量
          right: 30, // 右侧偏移量
          bottom: 5, // 底部偏移量
          left: 100 // 左侧偏移量
        }
      });
    },


    // 折线图
    lineChartFn() {
      this.lineChart = c3.generate({
        bindto: this.$refs.line,
        data: this.lineData,
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d' // 时间格式
            }
          },
          y: {
            label: {
              text: '成本费用(元)',
              position: 'outer-middle'
            }
          }
        },
        padding: {
          top: 10, // 顶部偏移量
          right: 30, // 右侧偏移量
          bottom: 5, // 底部偏移量
          left: 100 // 左侧偏移量
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
#box {
  height: calc(100% - 95px);
  min-height: 700px;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  padding: 5px;
  background-color: #fff;
  overflow: auto;
  box-sizing: border-box;

  >div {
    width: 49%;
    height: 48%;
    background-color: white;
    border: 1px solid #ccc;
    margin: 5px;
    min-height: 375px;

    .c3 {
      height: calc(100% - 40px) !important;
    }
  }

  #c3 {
    width: calc(98% + 10px);
  }

  .title {
    height: 40px;
    line-height: 40px;
    border-bottom: 4px solid #3d91ff;

    .icon {
      width: 11px;
      height: 11px;
      background: #3D91FF;
      transform: rotate(45deg);
      display: inline-block;
      margin: 0px 24px;
    }
  }

  :deep(.c3 svg) {
    font-family: MiSans-Regular;
  }

}
</style>