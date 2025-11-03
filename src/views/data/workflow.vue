<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab :title="title" :tabShow="false" :pageShow="false">
      <template>
        <div class="workflow">
          <!-- top -->
          <div class="top">
            <el-form :inline="true">
              <el-form-item>
                <el-input v-model="inputValue" type="primary" size="mini" placeholder="请输入工艺名称" clearable
                  @input="handleInputValue"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="mini" @click="searchData()">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- content -->
          <div class="content">
            <div class="left">
              <span class="title">工作流目录</span>
              <el-tree ref="tree" expand-on-click-node :props="defaultProps" :load="loadNode" lazy node-key="id"
                @node-click="handleNodeClick">
                <div class="custom-tree-node" slot-scope="{ node, data }">

                  <span> {{ node.label }}</span>

                  <div>
                    <el-tooltip effect="dark" placement="bottom">
                      <div slot="content">备注:{{ data.note }}</div>
                      <i class="el-icon-warning-outline" style="text-align: center"></i>
                    </el-tooltip>

                    <el-button type="text" @click.stop="isCanShowDialog(data, 'leftEdit')">编辑</el-button>
                  </div>
                </div>
              </el-tree>
            </div>

            <div class="right">
              <el-table :data="tableData" border>
                <template>
                  <el-table-column v-for="(tableKey, tableValue, index) in headerList" :key="index" :label="tableKey"
                    :prop="tableValue" align="left"></el-table-column>
                  <el-table-column label="操作" align="left">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="tableEdit(scope.row)">编辑</el-button>
                    </template>
                  </el-table-column>
                </template>
              </el-table>
            </div>
          </div>
        </div>
      </template>
      <Dialog :visible="visible" :title="dialogTitle" @submit="submit()" @show="isCanShowDialog()">
        <el-form ref="form" :model="directoryFrom" label-width="117px">
          <el-form-item label="目录名称">
            <el-input v-model="directoryFrom.catelogName" prop="directoryFromName" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="directoryFrom.note" :maxlength="20" show-word-limit></el-input>
          </el-form-item>
        </el-form>
      </Dialog>
    </Tab>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Dialog from "@/components/Dialog.vue";
import {
  techItem_treeGetLevels,
  techItem_treeUpdate,
  techItem_treeQueryById,
  techItem_treePage,
} from "../../utils/api";
export default {
  components: {
    Nav,
    Tab,
    Dialog,
  },
  data() {
    return {
      requestData: {
        page: "1",
        limit: "5",
        data: {
          parentId: "3",
          catelogName: "",
        },
      },
      title: "工作流目录管理",
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "退役申报基本参数管理",
          path: "/retirementDeclaration",
          isClick: false,
        },
        {
          name: "工作流目录",
          path: "/workflow",
          isClick: false,
        },
        {
          name: "退役成本",
          path: "/retireCost",
          isClick: false,
        },
        {
          name: "退役报表",
          path: "/parameter",
          isClick: false,
        },
        {
          name: "人工费",
          path: "/laborCost",
          isClick: false,
        },
      ],
      list: [],

      tableData: [],
      headerList: {
        catelogName: "工艺名称",
        "fkCreator.accountName": "创建人",
        createTime: "创建时间",
        note: "备注",
      },
      defaultProps: {
        id: "id",
        label: "catelogName",
        children: "children",
        isLeaf: "leaf",
      },
      visible: false,
      dialogTitle: "",
      rules: {
        directoryFromName: [{ required: true }],
      },
      directoryFrom: {
        id: "",
        catelogName: "",
        note: "",
      },
      pages: {
        page: 1,
        limit: 1,
        total: 5,
      },
      inputValue: "",
      // 强制刷新树形结构
      rootNode: {},
      rootResolve: "",
      leftState: false,
      // 等级
      level: "",
      leval2: "",
      leval3: "",
      // test
      rightState: true,
    };
  },
  created() {
    this.techItem_treePage();
  },
  methods: {
    async techItem_treePage() {
      const res = await techItem_treePage(this.requestData);
      if (res) {
        this.tableData = res.data.data.list;
        this.pages.page = res.data.data.pageNum;
        this.pages.limit = res.data.data.pageSize;
        this.pages.total = res.data.data.total;
      }
    },

    // test
    async loadNode(node, resolve) {
      let levelId;
      if (node.level === 0) {
        console.log(node);
        console.log(resolve);
        this.rootNode = node;
        this.rootResolve = resolve;
        levelId = 0;
        let res = await techItem_treeGetLevels({ levelId: levelId });
        if (res) {
          return resolve(res.data.data);
        }
      } else {
        levelId = node.data.id;
        let res = await techItem_treeGetLevels({ levelId: levelId });
        if (res) {
          console.log(res.data.data);
          if (node.level === 1) {
            console.log(res.data.data);
            res.data.data.forEach((item) => {
              item.leaf = true;
            });
          }
          return resolve(res.data.data);
        }
      }
    },
    //点击目录显示详细信息
    handleNodeClick(data) {
      this.requestData.data.parentId = data.id;
      if (data.catelogLevel == 1) {
        this.level = data.catelogName;
        this.inputValue = "";
        this.dialogTitle = "编辑:" + data.catelogName;
      }
      if (data.catelogLevel == 2) {
        this.rightState = false;
        this.inputValue = "";
        this.level2 = data.catelogName;
        this.dialogTitle = "编辑:" + this.level + "-" + data.catelogName;
        this.requestData.data.catelogName = "";
        this.techItem_treePage();
      }
    },
    // 弹框
    async isCanShowDialog(node, flag) {
      if (flag == "leftEdit") {
        this.directoryFrom.id = node.id;
        this.directoryFrom.catelogName = node.catelogName;
        this.directoryFrom.note = node.note;
        this.leftState = true;
        if (node.catelogLevel == 1) {
          this.level = node.catelogName;
          this.dialogTitle = "编辑:" + node.catelogName;
        }
        if (node.catelogLevel == 2) {
          this.dialogTitle = "编辑:" + this.level + "-" + node.catelogName;
          this.level2 = this.dialogTitle;
        }
        this.visible = !this.visible;
        return;
      }
      console.log(this.visible);
      if (!this.visible) {
        this.leftState = false;
        this.techItem_treeGetLevels({ levelId: node.data.id });
        this.dialogTitle = "编辑" + node.data.catelogName;
        this.directoryFrom.catelogName = node.data.catelogName;
        this.directoryFrom.id = node.data.id;

        let res = await techItem_treeQueryById({ id: node.data.id });
        this.directoryFrom.note = res.data.note;
      }
      this.visible = !this.visible;
    },
    tableEdit(row) {
      console.log(row);
      console.log(row.id);

      console.log(this.level);
      console.log(this.level2);
      if (this.rightState) {
        this.dialogTitle = "编辑:退费-退役规划-" + row.catelogName;
      } else {
        this.dialogTitle =
          "编辑:" + this.level + "-" + this.level2 + "-" + row.catelogName;
      }
      this.directoryFrom.catelogName = row.catelogName;
      this.directoryFrom.id = row.id;
      this.directoryFrom.note = row.note;
      this.visible = !this.visible;
    },
    // 提交
    async submit() {
      console.log(this.directoryFrom);
      let res = await techItem_treeUpdate(this.directoryFrom);
      this.visible = !this.visible;
      this.techItem_treePage();
      if (this.leftState) {
        this.resetNode();
      }
    },

    //切换条数
    handleSizeChange(val) {
      this.requestData.limit = val;
      this.techItem_treePage();
    },
    //切换页码
    handleCurrentChange(val) {
      this.requestData.page = val;
      this.techItem_treePage();
    },

    // 搜索
    searchData() {
      this.requestData.page = 1;
      this.requestData.data.catelogName = this.inputValue;
      this.techItem_treePage();
    },
    handleInputValue(ev) {
      if (ev == "") {
        this.requestData.data.catelogName = "";
        this.techItem_treePage();
      }
    },
    resetNode() {
      var theChildren = this.rootNode.childNodes;
      theChildren.splice(0, theChildren.length);
      this.loadNode(this.rootNode, this.rootResolve);
    },
  },
};
</script>

<style scoped>
.workflow {
  height: 80%;
}

.top {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.top>.el-input {
  width: 200px;
  margin-right: 10px;
}

.content {
  height: 100%;
  display: flex;
  margin-top: 20px;
  border-top: 1px solid #ebebeb;
}

.left>.title {
  display: block;
  width: 360px;
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  color: #333333;
  border-bottom: 0;
  margin-top: 40px;
}

.left {
  height: 100%;
  width: 450px;
  margin-left: 20px;
  border-right: 1px solid #ebebeb;
}

/* .left>div {
  line-height: 36px;
  color: #333;
  opacity: 1;
  cursor: pointer;
  margin: 10px 0;
} */

:deep(.custom-tree-node),
:deep(.el-tree-node__content) {
  display: flex;
  height: 36px;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  font-size: 14px;
  color: #333;
}

.right {
  width: 100%;
  padding: 20px;
}

.el-tree {
  margin-right: 30px !important;
}

.custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
}

.tablePagination {
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
