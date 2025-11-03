
<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab title="核退役项目" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input placeholder="请输入片区名称" v-model="request.data.areaName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" v-model="request.data.buildName"
              placeholder="请输入设施名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input placeholder="请输入项目名称" v-model="request.data.projectName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" v-has="{
              action: '/prj/project/add',
              effect: 'disabled',
            }" @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="操作" width="350px" align="left">
          <template slot-scope="scope">
            <el-button v-has="{
              action: '/prj/project/staff/assignStaff',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('项目分配', scope.row)">项目分配</el-button>
            <el-button v-has="{
              action: '/prj/project/staff/assignStaff',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('编写分配', scope.row)">编写分配</el-button>
            <el-button v-has="{
              action: '/prj/project/update',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
      <template slot="pagination">
        <el-pagination background @current-change="pageChange" @size-change="limitChange" :current-page="request.page"
          :page-size="request.limit" :total="request.total" :page-sizes="[5, 10, 20, 30, 40, 50, 100, 150, 200]"
          layout="total,sizes,prev,pager,next"></el-pagination>
      </template>
    </Tab>


    <Dialog :title="title" :visible="visible" @submit="submit" @show="show" width="70%">
      <el-row v-if="title == '编写分配'">


        <el-col :span="8">
          <!-- default-expand-all -->
          <el-tree :data="treeData" :props="treeProps" @node-click="nodeClick" default-expand-all
            :current-node-key="wordId"></el-tree>
        </el-col>

        <el-col v-show="titleArr.length" :span="16" class="right">
          <div class="tip">温馨提示:项目建议书及代实施方案人员分配完毕均需点击确定按钮保存!</div>
          <el-row v-for="(item, index) in titleArr" :key="item.titleNameOne">
            <el-col :span="12"> {{ item.titleNameOne }} </el-col>
            <el-col :span="12">
              <el-select clearable size="mini" v-model="item.staffId" filterable>
                <el-option v-for="i in staffArr" :key="i.staffId" :value="i.staffId" :label="i.staffName +
                  ' ' +
                  (i.phoneNum ? i.phoneNum : '') +
                  (i.accountStatus ? '' : '(已离职)')
                  "></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-col>

      </el-row>

      <!-- 此处关闭模态后需要销毁 -->
      <div v-else-if="title == '项目分配' && visible">
        <el-transfer v-model="transferValue" filterable :data="transferData" :titles="['未选择名单', '已选择名单']"
          @change="handleChange">
          <span slot-scope="{ option }">
            <div class="transfer_between">
              {{ option.label }}
            </div>
          </span>
          <div slot="right-footer">
            <el-button class="transfer-footer" size="mini" @click="showLeaderDialog(transferData)">
              设置负责人
            </el-button>
            &nbsp;&nbsp;&nbsp;
            <span>当前：</span>
            <el-tag type="info" size="small" v-if="leaderId">{{ leaderInfo }}</el-tag>
            <el-tag type="warning" size="small" v-else>未选择负责人</el-tag>
          </div>
        </el-transfer>
      </div>

      <el-form v-else ref="form" :model="form" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="buildVo.buildId" label="设施名称">
              <el-select size="small" :disabled="title == '编辑' ? true : false" filterable v-model="form.buildVo.buildId">
                <el-option v-for="item in parentProjectList" :key="item.buildId" :value="item.buildId"
                  :label="item.buildName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="projectName" label="项目名称">
              <el-input size="small" v-model="form.projectName" show-word-limit maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>


    <div style="width: 100px;">
      <Dialog title="设置负责人" width="30% " :visible.sync="leaderVisible" :showBtn="true" @submit="leaderSubmit"
        @show="leaderShow">
        <el-select v-model="leaderId" placeholder="请选择负责人">
          <el-option v-for="item in transfeCheckedMembers" :key="item.key" :label="item.label" :value="item.key">
          </el-option>
        </el-select>
      </Dialog>
    </div>
  </div>
</template>

<script>
import {
  prjProjectAdd as add,
  prjProjectUpdate as update,
  prjProjectPage as requestFn,
  // 查询所有设施list
  prjProjectGetBuildList,
  // 查询全部项目人员
  prjProjectGetStaffList,
  // 项目中设置编写人员
  prjProjectStaffAssignStaff,
  // 查询项目编写人员id数组
  prjProjectStaffGetBindStaffIds,
  // 查询项目编写人员信息
  prjProjectStaffGetStaffListByProjectId,
  // 查询一级标题
  prjProjectWriteFindWordTitleOneInfo,
  // 保存任务分配人员关系
  prjProjectWriteSetTaskStaff,
} from "../../utils/api";
import { mixins } from "../../mixin";
export default {
  mixins: [mixins],
  data() {
    return {
      nav: [
        {
          name: "项目管理",
          path: "/project",
          isClick: false,
        },
        {
          name: "核退役项目",
          path: "/ndpChildManage",
          isClick: false,
        },
      ],
      headerList: {
        "buildVo.areaName": "片区名称",
        "buildVo.buildName": "设施名称",
        projectName: "项目名称",
        "accountVo.accountName": "创建人",
        createTime: "创建时间",
      },
      request: {
        data: {
          areaName: "",
          buildName: "",
          projectName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },
      // 查询所有设施list
      childProjectFindParentProjectListRequest: {
        data: "",
        page: 1,
        limit: 1000,
      },
      // 查询全部项目人员
      childProjectFindAllstaffRequest: {
        data: {
          staffName: "",
          phoneNum: "",
        },
        page: 1,
        limit: 1000,
      },
      title: "",
      visible: false,
      leaderVisible: false,
      deleteValue: "",

      // 设施
      parentProjectList: [],
      form: {
        buildVo: {
          buildId: "",
        },
        projectName: "",
      },
      rules: {
        "buildVo.buildId": [
          { required: true, message: "设施名称不能为空", trigger: "blur" },
        ],
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
      },
      // 树
      projectId: "",

      titleArr: [],
      staffArr: [],
      wordId: 1,
      treeData: [
        {
          name: "",
          children: [
            {
              name: "项目建议书",
              id: 1,
            },
            {
              name: "代实施方案",
              id: 2,
            },
          ],
        },
      ],
      treeProps: {
        children: "children",
        label: "name",
      },
      // 穿梭
      transferData: [],
      transferValue: [],
      transfeCheckedMembers: [],


      // 项目负责人

      leaderId: null,
      leaderInfo: ''
    };
  },
  created() {
    this.prjProjectGetBuildList();
    this.prjProjectGetStaffList();
  },
  methods: {
    handleChange(value, direction, movedKeys) {
      if (direction == 'left' && !this.transferValue.includes(this.leaderId)) this.leaderId = null
    },

    showLeaderDialog(transferData) {
      this.transfeCheckedMembers = transferData.filter(item => this.transferValue.includes(item.key))
      this.leaderVisible = true
    },
    leaderSubmit() {
      let temp = this.transferData.find(item => item.key == this.leaderId)
      if (temp) this.leaderInfo = temp.label
      this.leaderVisible = false;
    },
    leaderShow() {
      this.leaderVisible = false;
    },

    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);
    },
    // 设施
    async prjProjectGetBuildList() {
      const res = await prjProjectGetBuildList(
        this.childProjectFindParentProjectListRequest
      );
      if (res) this.parentProjectList = res.data.data.list;
    },
    // 穿梭
    async prjProjectGetStaffList() {
      const res = await prjProjectGetStaffList(
        this.childProjectFindAllstaffRequest
      );
      if (res) {
        this.transferData = res.data.data.list.map((item) => ({
          key: item.staffId,
          label: item.staffName + ' ' + (item.phoneNum ? item.phoneNum : '') + (item.accountStatus ? '' : '(已离职)'),
          disabled: false,
        }));
      }
    },
    // event
    async addOrUpdateOrDelete(title, row) {
      this.show();
      this.title = title;
      this.projectId = "";
      if (title == "项目分配") {
        this.leaderId = ''
        this.projectId = row.projectId;
        const res = await prjProjectStaffGetStaffListByProjectId({
          projectId: this.projectId,
        });
        if (res) {
          this.transferValue = res.data.data.map(item => {
            if (item.leaderFlag) {
              this.leaderId = item.staffId
              this.leaderInfo = item.staffName + ' ' + (item.phoneNum ? item.phoneNum : '') + (item.accountStatus ? '' : '(已离职)')
            }
            return item.staffId
          });
        }
      }

      if (title == "编写分配") {
        this.wordId = 1
        this.titleArr = [];
        this.treeData[0].name = row.projectName;
        this.projectId = row.projectId;
        const res1 = await prjProjectStaffGetStaffListByProjectId({
          projectId: this.projectId,
        });
        if (res1) this.staffArr = res1.data.data;
        const res2 = await prjProjectWriteFindWordTitleOneInfo({
          wordId: this.wordId,
          projectId: this.projectId,
        });
        if (res2) this.titleArr = res2.data.data;
      }

      if (title == "编辑") {
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
        });
      }
    },
    async submit() {
      let res;
      switch (this.title) {
        case "项目分配":
          res = await prjProjectStaffAssignStaff({
            projectId: this.projectId,
            staffIds: this.transferValue,
            leaderId: this.leaderId
          });
          this.show();
          break;
        case "编写分配":
          res = await prjProjectWriteSetTaskStaff({
            fkWordId: this.wordId,
            projectId: this.projectId,
            titleMap: this.titleArr,
          });
          this.show();
          break;
        default:
          this.$refs["form"].validate(async (valid) => {
            if (valid) {
              if (this.title == "新增") {
                res = await add(this.form);
              } else {
                res = await update(this.form);
              }
              this.show();
            } else {
              this.$message({
                offset: 170,
                duration: "1000",
                message: "未通过校验，请按表单中的提示修改",
                type: "warning",
              })
            }
          });
      }
    },
    // 获取所有标题
    async nodeClick(node) {
      console.log(node.id);
      if (!node.children) {
        this.wordId = node.id;
        const res = await prjProjectWriteFindWordTitleOneInfo({
          wordId: node.id,
          projectId: this.projectId,
        });
        if (res) this.titleArr = res.data.data;
      }
    },
  },

};


</script>

<style lang='less' scoped>
.right {
  border-bottom: 1px solid #dddddd;
  border-right: 1px solid #dddddd;

  .el-col {
    border: 1px solid #dddddd;
    height: 40px;
    line-height: 40px;
    padding: 0 5px;
    border-bottom: 0;
    border-right: 0;
  }
}

.transfer_between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-transfer) {
  display: flex;
  justify-content: space-around;
  align-items: center;

  .el-transfer-panel {
    width: 370px;
    border-radius: 0;

    .el-transfer-panel__body {
      height: 400px;

      .el-transfer-panel__list.is-filterable {
        min-height: 350px;
      }
    }
  }

  .el-transfer__buttons {
    display: flex;
  }

  .el-transfer__button:first-child {
    margin-bottom: 0px;
  }


}

:deep(.tip) {
  color: red;
  font-size: 12px;
  margin-bottom: 10px;
}
</style>