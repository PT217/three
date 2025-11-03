<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="项目建议书列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input clearable size="mini" v-model="request.data.areaName" placeholder="请输入片区名称">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input clearable size="mini" v-model="request.data.buildName" placeholder="请输入设施名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input clearable size="mini" v-model="request.data.projectName" placeholder="请输入项目名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input clearable size="mini" v-model="request.data.schemeName" placeholder="请输入建议书名称">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" v-has="{
              action: '/tech/proposal/add',
              effect: 'disabled',
            }" @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="批准" align="left">
          <template slot-scope="scope">
            <el-switch v-has="{
              action: '/tech/proposal/updateFinalFlag',
              effect: 'disabled',
            }" v-model="scope.row.projectProposalFinalFlag" :inactive-value="0" :active-value="1"
              @change="switchValueChange($event, scope)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="300px" align="left">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button v-has="{
              action: '/tech/proposal/update',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑封面</el-button>

            <!-- 编写文档 -->
            <el-button v-has="{
              action: '/tech/proposal/update',
              effect: 'disabled',
            }" type="primary" size="mini" @click="editWord(scope.row)">编辑文档</el-button>

            <!-- 删除 -->
            <el-button v-has="{
              action: '/tech/proposal/delete',
              effect: 'disabled',
            }" type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>

    <!-- 新增及编辑弹框 -->
    <Dialog :visible="visible" :title="title" @show="show" @submit="submit">
      <template>
        <div v-if="title == '删除'">您确定要删除吗？</div>

        <div v-else-if="title == '批准'" v-html="switchContent"></div>

        <div v-else>
          <el-form ref="form" :rules="rules" :model="form" label-width="117px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="设施名称:" prop="buildVo.buildId">
                  <el-select v-model="form.buildVo.buildId" placeholder="请选择设施" filterable clearable
                    :disabled="title == '新增' ? false : true" default-first-option @change="HandlerSelectParentPVO">
                    <div class="option">
                      <el-option v-for="item in approvalParentList" :key="item.buildId" :label="item.buildName"
                        :value="item.buildId"></el-option>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="项目名称:" prop="projectVo.projectId">
                  <el-select v-model="form.projectVo.projectId" placeholder="请选择项目" filterable clearable
                    :disabled="title == '新增' ? false : true" default-first-option>
                    <div class="option">
                      <el-option v-for="item in childProjectList" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId"></el-option>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="建议书名称:" prop="projectProposalName">
                  <el-input v-model="form.projectProposalName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="集团公司名称:" prop="groupCompanyName">
                  <el-input v-model="form.groupCompanyName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="业主公司名称:" prop="ownerCompanyName">
                  <el-input v-model="form.ownerCompanyName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="设计公司名称:" prop="designCompanyName">
                  <el-input v-model="form.designCompanyName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="立项时间:" prop="projectTime">
                  <el-input v-model="form.projectTime" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="法人代表名称:" prop="corporateRepName">
                  <el-input v-model="form.corporateRepName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="工程号:" prop="jobNum">
                  <el-input v-model="form.jobNum" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="子项号或系统号:" prop="sysNum">
                  <el-input v-model="form.sysNum" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="子项或系统名称:" prop="sysName">
                  <el-input v-model="form.sysName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="工种:" prop="workType">
                  <el-input v-model="form.workType" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="图册(文件)名称:" prop="fileName">
                  <el-input v-model="form.fileName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="图册(文件)序号:" prop="fileNum">
                  <el-input v-model="form.fileNum" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="批准:" prop="ratifyName">
                  <el-input v-model="form.ratifyName" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="工程设计证书:" prop="engineeringDesignCertificate">
                  <el-input v-model="form.engineeringDesignCertificate" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="审定:" prop="judgement">
                  <el-input v-model="form.judgement" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="审核:" prop="examineAndApprove">
                  <el-input v-model="form.examineAndApprove" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="校对:" prop="proofread">
                  <el-input v-model="form.proofread" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="编制:" prop="write">
                  <el-input v-model="form.write" maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import {
  techProposalAdd as add,
  techProposalUpdate as update,
  techProposalPage as requestFn,
  techProposalDelete as deleteFn,
  // 批准
  projectProposalInfoUpdateFinalFlag,

  // 获取已批准的所有项目
  techProposalFindProposalBuildList,
  // 获取已批准的所有项目
  techProposalFindProjectVoListOfProjectProposal,
} from "../../utils/api";
import Dialog from "@/components/Dialog.vue";
import Nav from "../../components/Nav";
import Tab from "../../components/Tab";
export default {
  name: "proposal",
  components: {
    Tab,
    Dialog,
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
          name: "项目建议书",
          path: "/proposal",
          isClick: false,
        },
      ],
      title: "",
      // 表格展示
      tableData: [],
      headerList: {
        "buildVo.areaName": "片区名称",
        "buildVo.buildName": "设施名称",
        "projectVo.projectName": "项目名称",
        projectProposalName: "建议书名称",
        creatorName: "创建用户",
        createTime: "创建时间",
      },

      // 表格数据
      request: {
        data: {
          areaName: "",
          buildName: "",
          projectName: "",
          schemeName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },
      // 已批准的项目列表请求
      approvalReq: {
        data: "",
        page: 1,
        limit: 10000,
      },
      //
      childApprovalReq: {
        data: "",
        page: 1,
        limit: 10,
      },
      // 已批准的项目列表数组
      approvalParentList: [],
      // 已批准项目列表
      childProjectList: [],
      // 新增与编辑
      form: {
        buildVo: {
          buildId: "",
        },
        projectVo: {
          projectId: "",
        },
        projectProposalName: "",
        groupCompanyName: "",
        ownerCompanyName: "",
        designCompanyName: "",
        projectTime: "",
        corporateRepName: "",
        jobNum: "",
        sysNum: "",
        sysName: "",
        workType: "",
        fileName: "",
        fileNum: "",
        ratifyName: "",
        engineeringDesignCertificate: "",
        judgement: "",
        examineAndApprove: "",
        proofread: "",
        write: "",
      },

      // 编辑中项目名中转仓
      cpid: "",
      // 新增编辑弹框
      visible: false,
      title: "",
      // 删除
      delStatus: false,
      // 批准
      approvalStatus: false,
      // switch
      projectProposalInfoId: "",
      switchContent: "",
      switchDel: false,

      //新增分页
      currentPage: 1,
      pagesize: 3,
      totalnum: 3,

      rules: {
        projectProposalName: [
          { required: true, message: "建议书名称不能为空", trigger: "blur" },
        ],
        "buildVo.buildId": [
          { required: true, message: "设施名称不能为空", trigger: "blur" },
        ],
        "projectVo.projectId": [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.requestFn();
    this.techProposalFindProposalBuildList();
  },
  methods: {
    // 获取table数据
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      let res = await requestFn(this.request);
      if (res) {
        this.tableData = res.data.data.list;
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
      }
    },

    // 获取已批准的工程结构分解的项目列表
    async techProposalFindProposalBuildList() {
      const res =
        await techProposalFindProposalBuildList(
          this.approvalReq
        );
      if (res) this.approvalParentList = res.data.data.list;
    },

    //处理新增时设施选择下拉 改变项目的值
    HandlerSelectParentPVO(e) {
      //清空项目下拉
      this.form.projectVo.projectId = "";

      this.techProposalFindProjectVoListOfProjectProposal(e);
    },

    //获取项目列表
    async techProposalFindProjectVoListOfProjectProposal(e) {
      this.childApprovalReq.data = e;
      const res =
        await techProposalFindProjectVoListOfProjectProposal(
          this.childApprovalReq
        );
      if (res) this.childProjectList = res.data.data.list;
    },

    //编写文档
    editWord(row) {
      console.log(row);
      this.$router.push({
        name: "proposalText",
      });

      localStorage.setItem(
        "proposalName",
        row.areaName +
        "-" +
        row.buildVo.buildName +
        "-" +
        row.projectVo.projectName
      );
      localStorage.setItem(
        "buildId",
        row.buildVo.buildId
      );
      localStorage.setItem(
        "projectId",
        row.projectVo.projectId
      );
      localStorage.setItem("conductId", row.projectProposalId);
    },

    addOrUpdateOrDelete(title, row) {
      this.title = title
      this.show();
      if (this.title == '删除') return this.deleteValue = row.projectProposalId;
      if (row) {
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
        });
      }
    },
    // AddOrEditOrDel弹框
    show() {
      if (this.visible) {
        if (this.title == "新增" || this.title == "编辑") this.$refs["form"].resetFields();
        this.requestFn()
      }
      this.visible = !this.visible;
    },
    // 确认提交
    async submit() {
      if (this.title == '删除') {
        await deleteFn({
          projectProposalInfoId: this.deleteValue,
        });
        this.show();
      } else if (this.title == '批准') {
        await projectProposalInfoUpdateFinalFlag({
          projectProposalInfoId: this.projectProposalInfoId,
          finalFlag: this.finalFlag,
        });
        this.show();
      } else {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (this.title == "新增") {
              await add({
                ...this.form,
                buildId:
                  this.form.buildVo.buildId,
                projectId: this.form.projectVo.projectId,
              });

            } else {
              const res = await update(this.form);
            }
            this.show();
          } else {
            this.$message({
              offset: 170,
              duration: "1000",
              message: '未通过校验，请按表单中的提示修改',
              type: "warning",
            });
          }
        });
      }
    },
    // 改变switch状态
    async switchValueChange(ev, { row }) {

      this.title = '批准'

      console.log(this.title);
      this.projectProposalInfoId = row.projectProposalId;
      this.visible = !this.visible;
      // 开启;
      if (ev) {
        this.switchDel = false;
        this.finalFlag = 1;
        this.switchContent = `您确定要批准
          <b>${row.areaName}</b
          >-<b>${row.buildVo.buildName}</b
          >-<b>${row.projectVo.projectName}</b
          >-<b>${row.projectProposalName}</b> 项目建议书吗？`;
      } else {
        this.switchDel = true;
        this.finalFlag = 0;
        this.switchContent =
          "此项目相关的代实施方案及内容将全部清除,您确定要这样做吗？";
      }
    },

    //切换条数
    limitChange(val) {
      this.request.limit = val;
      this.requestFn();
    },

    //切换页数
    pageChange(val) {
      console.log(val);
      this.request.page = val;
      this.requestFn();
    },
  },
};
</script>

<style scoped>
.el-select {
  width: 100% !important;
}
</style>