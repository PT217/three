<template>
  <div class="container">
    <Nav :nav="nav">
      <template slot="right">
        <el-button type="primary" size="mini" @click.prevent="$router.push({ name: 'ndpProManage' })">返回</el-button>
      </template>
    </Nav>
    <Tab :title="title" :tabShow="false" :pageShow="false">
      <Wall menu style="height:calc(100% - 70px)" :tasks="tasks"></Wall>
    </Tab>
  </div>
</template>

<script>

import {
  prjBuildGetGantt
} from "../../utils/api";
import moment from "moment";

import Wall from "../../components/Wall.vue";
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab";

export default {
  components: {
    Wall,
    Nav,
    Tab,
  },
  data() {
    return {
      nav: [
        {
          name: "项目管理",
          path: "/project",
          isClick: false,
        },
        {
          name: "核退役设施",
          path: "/ndpProManage",
          isClick: false,
        },
        {
          name: "挂图作战",
          path: "/wallChart2",
          isClick: false,
        },
      ],
      title: "挂图作战",
      tasks: {
        data: [],
        // 脱线
        links: []
      },
    };
  },

  created() {

  },
  mounted() {
    this.prjBuildGetGantt()

  },

  beforeDestroy() {
    localStorage.removeItem('buildId')
  },
  methods: {
    // 获取gantt数据
    async prjBuildGetGantt() {
      console.log(this.tasks.data);
      let res = await prjBuildGetGantt({ buildId: localStorage.getItem('buildId') });
      console.log(res);
      if (res) {
        console.log(res.data.data);
        this.tasks.data = res.data.data.map(item => {


          if (item.text == 'build') return {
            ...item,
            start_date: moment(new Date()).format("YYYY-MM-DD"),
            end_date: moment(new Date()).format("YYYY-MM-DD"),
            status: true
          }
          if (item.startDate) return {
            ...item,
            start_date: item.startDate,
            end_date: moment(item.endDate)
              .add(1, "days")
              .format("YYYY-MM-DD")
          }
          return {
            ...item,
            start_date: moment(new Date()).format("YYYY-MM-DD"),
            end_date: moment(new Date()).format("YYYY-MM-DD"),
            text: '未定义',
            status: true
          }
        })
      }
    },
  }
}
</script>

<style lang='less' scoped>
.container {

  // 计划
  :deep(.plan) {
    background: linear-gradient(270deg, #09d3bc 0%, #5fda7c 100%) !important;
  }

  // 实际
  :deep(.actual) {
    background: linear-gradient(90deg, #3d91ff 0%, #2c6feb 100%) !important;
  }

  // 滚动条
  :deep(::-webkit-scrollbar) {
    height: 5px !important;
  }

  // 左边选中
  :deep(.gantt_grid_data .gantt_row.gantt_selected),
  :deep(.gantt_task_row.gantt_selected),
  :deep(.gantt_grid_data .gantt_row):hover {
    background-color: #e4e7ec !important;
  }

  :deep(.gantt_scale_cell.gantt_last_cell),
  :deep(.gantt_scale_cell),
  :deep(.gantt_grid_head_cell),
  :deep(.gantt_task_vscroll) {
    background-color: #f6f6f6;
  }


  :deep(.gantt_grid_data .gantt_cell) {
    color: #666 !important;
    font-size: 14px;
    padding: 0;
  }

  :deep(.gantt_tree_icon) {
    display: none;
  }

  :deep(.gantt-error),
  :deep(.status),
  :deep(.gantt_task_progress_drag) {
    display: none;
  }

  :deep(.gantt_tree_icon.gantt_file) {
    background-image: none;
  }


  :deep(.gantt_grid_head_cell),
  :deep(.gantt_scale_cell) {
    font-weight: 700;
    font-size: 16px;
    color: #333 !important;
    // text-align: left;
  }

  :deep(.gantt_container) {
    font-family: MiSans-Regular;
  }

}
</style>

