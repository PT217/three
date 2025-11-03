
<template>
  <div class="header">
    <!-- left -->
    <div class="left">
      <div>
        <img src="../assets/home/zh.png" />
        <span class="title">核设施数字化退役平台</span>
      </div>
      <el-menu :default-active="$store.getters.link" class="el-menu-header" mode="horizontal" background-color="#202337"
        text-color="#fff" active-text-color="#0143CE" @select="handleSelect">
        <el-menu-item index="/home">首页</el-menu-item>
        <el-menu-item index="/project">项目管理</el-menu-item>
        <el-menu-item index="/technology">技术管理</el-menu-item>
        <el-menu-item index="/construction">施工管理</el-menu-item>
        <el-menu-item index="/data">数据管理</el-menu-item>
      </el-menu>
    </div>

    <!-- right -->
    <div class="right">
      <div>
        <!-- <span>系统授权到期时间:</span>
        <span>2023-02-28</span> -->
      </div>
      <div>
        <el-dropdown trigger="click" @command="handleCommand">
          <img src="../assets/home/lct.png" />
          <el-dropdown-menu slot="dropdown" class="header-new-drop">
            <el-dropdown-item command="/flowChartList">
              流程图
              <!-- <span class="font">流程图</span> -->

            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-dropdown trigger="click" @command="handleCommand">
          <img class="rightImg" src="../assets/home/sz.png" />
          <el-dropdown-menu slot="dropdown" class="header-new-drop">
            <!-- <el-dropdown-item icon="el-icon-user" command="/userManage"
              >用户管理</el-dropdown-item
            > -->
            <el-dropdown-item icon="el-icon-switch-button" command="/login">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog title="工作流列表" :visible="dialogTableVisible" :before-close="close" :close-on-click-modal="false"
      class="dialogTable">
      <el-button class="addBtn" type="primary" size="mini" @click="headerAdd">新增</el-button>
      <el-table :data="tableData" max-height="500px" :header-row-style="{ backgroundColor: '#E8E8E8' }" border>
        <el-table-column label="工作流程略缩图" align="left">
          <template slot-scope="scope">
            <img :src="scope.row.flushPhoto" alt="" />
          </template>
        </el-table-column>
        <el-table-column property="creator.accountName" label="创建用户" align="left"></el-table-column>
        <el-table-column property="createTime" label="创建时间" align="left"></el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="新增流程图" :visible.sync="addFlowChartVisible" class="fullscreen" fullscreen>
      <HeaderX6 v-if="addFlowChartVisible" ref="HeaderX6" @handle="handle" :editValue="editValue"
        @closeDialog="closeDialog"></HeaderX6>
    </el-dialog>

    <el-dialog title="删除流程图" :visible.sync="delFlowChartVisible" width="40%">
      你确定要删除吗？
      <span slot="footer">
        <el-button @click="delFlowChartVisible = false">取 消</el-button>
        <el-button type="primary" @click="delSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  toolFlushAdd,
  toolFlushDelete,
  toolFlushPage,
  accountLogout,
} from "../utils/api";
import HeaderX6 from "./HeaderX6.vue";
import { mapMutations } from "vuex";

export default {
  props: {},
  components: {
    HeaderX6,
  },
  data() {
    return {
      flag: true,
      // 流程图列表弹框
      dialogTableVisible: false,
      // 新增弹框
      addFlowChartVisible: false,
      // 删除弹框
      delFlowChartVisible: false,
      // 流程图列表请求
      flowChartListReq: {
        data: {},
        page: 1,
        limit: 10,
      },
      // 流程图数据
      tableData: [],
      // 编辑信息
      editValue: {},
      // 删除信息
      delValue: "",
    };
  },

  // watch: {
  //   "$route": {
  //     handler(newVal, oldVal) {

  //       console.log(newVal);
  //       console.log(oldVal);



  //     },
  //     immediate: true
  //   }
  // },
  methods: {
    ...mapMutations(["setState"]),
    //导航
    handleSelect(key, keyPath) {
      this.$router.push({ path: key });
      this.setState({ link: key })
    },
    // 流程图列表
    async toolFlushPage() {
      const res = await toolFlushPage(this.flowChartListReq);
      if (res) {
        this.tableData = res.data.data.list;
        this.addFlowChartVisible = false;
      }
    },

    handleCommand(path) {
      if (path == "/flowChartList") {
        this.dialogTableVisible = true;
        this.toolFlushPage();
        return;
      }
      if (path == "/login") {
        this.setState({ link: "/home" })
        setTimeout(() => {
          accountLogout();
        }, 0)
      }
    },
    // 新增
    headerAdd() {
      if (this.tableData.length == 10)
        return this.$message({
          offset: 170,
          duration: "1000",
          message: "已有十条流程图,不可再新增",
          type: "warning",
        });
      this.addFlowChartVisible = true;
      this.flag = true;
    },
    close() {
      this.dialogTableVisible = false;
    },
    // 关闭流程图模态框
    closeDialog() {
      this.addFlowChartVisible = false;
    },
    //流程图数据处理
    async handle(x6Data) {
      x6Data.graph.clearCells();
      if (this.flag) {
        const res = await toolFlushAdd({
          flushPhoto: x6Data.img,
          flushContent: x6Data.data,
        });
      } else {
        const res = await toolFlushAdd({
          flushPhoto: x6Data.img,
          flushContent: x6Data.data,
          flushId: this.editValue.flushId,
        });
      }
      this.toolFlushPage();
    },
    // 编辑单个流程图
    handleEdit(row) {
      this.addFlowChartVisible = true;
      this.flag = false;
      this.$nextTick(() => {
        this.editValue = Object.assign({}, row);
      });
    },
    // 删除单个流程图
    handleDelete(row) {
      console.log(row);
      this.delValue = row.flushId;
      this.delFlowChartVisible = true;
    },
    // 提交删除信息
    async delSubmit() {
      console.log(this.delValue);
      const res = await toolFlushDelete({
        flushId: this.delValue,
      });
      this.tableData = this.tableData.filter(
        (item) => item.flushId != this.delValue
      );
      this.delFlowChartVisible = false;
    },
  },
};
</script>

<style lang='less' scoped>
.header {
  padding: 0 20px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 3px 10px rgba(48, 116, 237, 0.16);
  background-color: #202337;

  .left {
    width: 66%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: 700;
      vertical-align: middle;
      color: #fff;
    }

    .el-menu-header {
      border-bottom: 0;
    }

    .el-menu-item {
      font-size: 18px;
    }
  }

  .right {
    margin-right: 20px;
    width: 22%;
    display: flex;
    justify-content: flex-end;
    // justify-content: space-between;
    align-items: center;




    >div {
      margin-left: 40px;
    }

    img {
      width: 26px;
      height: 26px;
      cursor: pointer;
    }

    span {
      color: #fff;
    }
  }

  img {
    width: 38px;
    height: 38px;
    vertical-align: middle;
  }

  :deep(.fullscreen .el-dialog__body) {
    padding: 0 !important;

    :deep(.el-table__cell) {
      padding: 0;
    }
  }

  .dialogTable {
    .el-table {

      :deep(th.el-table__cell.is-leaf) {
        border-right: 0;
        color: #333;
        font-size: 16px;
        font-weight: bold;
        background-color: #F6F6F6;
      }

      :deep(.cell) {
        padding-left: 0px !important;
      }
    }

    .el-button {
      border-radius: 0;
    }

    .addBtn {
      float: right;
      margin: 20px;
      border-radius: 0;
    }
  }
}
</style>
<style>
.header-new-drop li {
  font-family: MiSans-Regular
}
</style>