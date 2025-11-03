<template>
  <div>
    <div class="img"> </div>
    <div class="mybody">
      <div class="body-unit bg-1" @click="iconClickFn('/project', '/ndpChildManage')">
        <div>
          <el-image style="width: 90px; height: 90px; margin-bottom: 20px" :src="iconUrlList[0]" fit="contain"></el-image>
          <br />
          <span>退役项目管理</span>
        </div>
      </div>
      <div class="body-unit bg-2" @click="iconClickFn('/project', '/taskManage')">
        <div>
          <el-image style="width: 90px; height: 90px; margin-bottom: 20px" :src="iconUrlList[1]" fit="contain"></el-image>
          <br />
          <span>任务管理</span>
        </div>
      </div>
      <div class="body-unit bg-3" @click="iconClickFn('/construction', '/proSchedule')">
        <div>
          <el-image style="width: 90px; height: 90px; margin-bottom: 20px" :src="iconUrlList[2]" fit="contain"></el-image>
          <br />
          <span>施工管理</span>
        </div>
      </div>
      <div class="body-unit bg-0 body-unit-data">

        <div class="data-title data-title-padding-top">
          <div class="title-icon"></div> <span>今日任务</span>
          <div class="title-text">
            <span>完成度:
              <div class="circle-icon icon-color-finish"></div>
              已完成
            </span>
          </div>
        </div>
        <div class="data-box">
          <el-progress type="circle" :percentage="parseInt(finishNum)" :width="200" :stroke-width="15" :color="'#4466EE'"
            :format="(e) => finishFn(e, 0)"></el-progress>
        </div>

      </div>

      <div class="body-unit bg-0">

        <div class="data-title">
          <div class="title-icon"></div> <span>任务预警</span>
          <i style="color: red; font-size: 12px; font-style: normal; margin-left: 5px;">已过期</i>
        </div>

        <!-- <a style=" color:rgb(96, 98, 102); text-decoration: underline black;" href="#">{{ scope.row.taskName
                  }}</a> -->
        <div class="data-table">
          <el-table :data="tableData" max-height="340px" :header-row-style="{ backgroundColor: '#E8E8E8' }">
            <el-table-column label="任务名称">
              <template slot-scope="scope">
                <span class="task" @click="showTaskInfo(scope.row)">{{ scope.row.taskName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="taskEndDate" label="任务时间">
            </el-table-column>
            <el-table-column prop="taskMemberName" label="任务负责人">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 任务详情的模态 -->
    <task-info :visible="visible" :width="'55%'" :taskDetail="taskDetail" @taskInfoClose="taskInfoClose"></task-info>
  </div>
</template>

<script>
import TaskInfo from '@/components/TaskInfo.vue'
import {
  // 获取首页数据
  prjTaskGetTaskHome,
  // 任务管理 查询一个任务的详情
  prjTaskGetDetails,
} from '../../utils/api'
import icon1 from '../../assets/home/tyxmgl.png'
import icon2 from '../../assets/home/rwgl.png'
import icon3 from '../../assets/home/sggl.png'
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      visible: false,
      taskDetail: {},

      iconUrlList: [
        icon1,
        icon2,
        icon3
      ],
      tableData: [],
      taskData: {
        finishTaskNum: 0,
        totalTaskNum: 0,
      },

    }
  },

  components: {
    TaskInfo
  },

  created() {
    this.prjTaskGetTaskHome()
  },
  computed: {
    // 今日完成
    finishNum() {
      if (this.taskData?.totalTaskNum == 0) {
        return 0
      } else {
        const result = (100 * this.taskData.finishTaskNum) / (this.taskData.totalTaskNum)
        return result
      }
    }
  },

  methods: {
    ...mapMutations(["setState"]),
    async prjTaskGetTaskHome() {
      const res = await prjTaskGetTaskHome()
      if (res) {
        this.tableData = res.data.data.taskVOList
        this.taskData.finishTaskNum = res.data.data.finishTaskNum
        this.taskData.totalTaskNum = res.data.data.totalTaskNum
      }
    },
    // 打开模态框 查看任务预警详情
    showTaskInfo(row) {
      this.prjTaskGetDetails(row)
    },

    /**
     * 任务详情
     */
    async prjTaskGetDetails(row) {
      const res = await prjTaskGetDetails({ taskId: row.taskId })
      if (res) {
        this.taskDetail = res.data.data
        this.visible = true;
      }
    },

    finishFn(percentage, index) {
      let ext = "已完成" + "\n\n" + this.taskData.finishTaskNum + "\n\n"
      return ext + percentage + "%"

    },
    iconClickFn(link, path) {
      this.setState({ link })
      this.$router.push({ path });
    },
    taskInfoClose(e) {
      this.visible = e
    }
  },
}
</script>

<style lang="less" scoped>
.img {
  width: 100vw;
  height: 52vh;
  background-image: url("../../assets/home/zybg.jpg");
  background-position: center;
  background-size: cover;
}

.mybody {
  width: 100vw;
  height: 48vh;
  padding-top: 16px;
  // border: 1px solid black;
  display: flex;
  align-items: center;
  overflow: hidden;

  .body-unit-data {
    margin: 0px 12px;
  }


  .body-unit {
    height: 100%;
    flex: 1;
    // border: 1px solid red;

    .data-title-padding-top {
      margin-top: 17px;
    }

    .data-title {
      height: calc(30% - 60px);
      // border: 1px solid black;

      display: flex;
      justify-content: flex-start;
      align-items: center;
      // text-align: center;
      flex-wrap: wrap;

      .title-text {
        width: 100%;
        margin: 5px;
        margin-left: 20px;

        span {
          font-size: 14px;
          line-height: 24px;
          font-weight: 400;
          color: #333333;
        }
      }

      .title-icon {
        width: 4px;
        height: 18px;
        background: #0143CE;
        margin: 0 5px 0 11px
      }

      span {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
      }
    }

    .data-box {
      // border: 1px solid black;
      height: 70%;
      margin: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }




  }

  .bg-0 {
    background-color: #FFFFFF;
  }

  .bg-1 {
    background-color: #5F99E4;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      padding-top: 20px;
      font-size: 24px;
      font-weight: bold;
      color: #FFFFFF;
      letter-spacing: 5px;
    }
  }

  .bg-2 {
    background-color: #7DB3E9;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      padding-top: 20px;
      font-size: 24px;
      font-weight: bold;
      color: #FFFFFF;
      letter-spacing: 5px;
    }
  }

  .bg-3 {
    background-color: #9ACAF0;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      padding-top: 20px;
      font-size: 24px;
      font-weight: bold;
      color: #FFFFFF;
      letter-spacing: 5px;
    }
  }

  .circle-icon {
    display: inline-block;
    width: 14px;
    height: 14px;
    line-height: 24px;
    border-radius: 50%;

  }

  .icon-color-finish {
    border: 3px solid #4466EE;
  }

  ::v-deep .el-progress__text {
    white-space: pre;
  }

  .data-table {
    overflow: auto;
    padding: 0 20px;

    :deep(.el-table__header-wrapper th) {
      height: 49px;
      color: #333;
      font-size: 14px;
      font-weight: 700;
    }

    :deep(.el-table th.el-table__cell) {
      background-color: transparent;
    }

    :deep(.el-table__body-wrapper .cell) {
      height: 40px;
      line-height: 40px;
      background-color: #F6F6F6;
      color: #666;
      font-size: 14px;
      margin-top: 10px;
    }

    :deep(.el-table .cell) {
      padding-left: 0;
    }

    .task {
      cursor: pointer;
    }

    :deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
      border-bottom: none;
    }

    :deep(.el-table .el-table__cell) {
      padding: 0;
    }
  }
}
</style>
