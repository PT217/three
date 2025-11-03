<template>
  <div class="programme">
    <Nav :nav="nav"></Nav>

    <Tab title="代实施方案列表" :tableData="tableData" :headerList="headerList">
      <template slot="select">
        <div class="search">
          <el-form inline>
            <!-- TODO后面要记得改字段名 -->
            <el-form-item>
              <el-input size="mini" v-model="request.data.areaName" placeholder="请输入片区名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-input size="mini" v-model="request.data.buildName" placeholder="请输入设施名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-input size="mini" v-model="request.data.projectName" placeholder="请输入项目名称" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-input size="mini" v-model="request.data.conductName" placeholder="请输入代实施方案" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="mini" @click="search()">搜索</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" v-has="{ action: '/tech/conduct/add', effect: 'disabled' }"
                @click.prevent="addOrUpdateOrDelete('新增')">新增</el-button>
            </el-form-item>
          </el-form>
        </div>
      </template>

      <template slot="column">
        <el-table-column label="确认最终方案" align="left">
          <template slot-scope="scope">
            <!-- v-has="{ action: '/schemeBasic/updateFinalFlag' }" -->
            <el-switch v-has="{
              action: '/tech/conduct/updateFinalFlag',
              effect: 'disabled',
            }" v-model="scope.row.finalFlag" :inactive-value="0" :active-value="1"
              @change="switchValueChange($event, scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="350px" align="left">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button v-has="{ action: '/tech/conduct/update', effect: 'disabled' }" type="primary" size="mini"
              @click="addOrUpdateOrDelete('编辑', scope.row)">编辑封面</el-button>
            <!-- 编写文档 -->
            <el-button v-has="{ action: '/tech/conduct/update', effect: 'disabled' }" type="primary" size="mini"
              @click="editWord(scope.row)">编辑文档</el-button>
            <!-- 删除 -->
            <el-button v-has="{ action: '/tech/conduct/delete', effect: 'disabled' }" type="danger" size="mini"
              @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>

      <template slot="pagination">
        <div class="tablePagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="request.page" :page-sizes="[5, 10, 20, 50, 100]" :page-size="request.limit"
            :total="request.total" layout="total,sizes,prev,pager,next"></el-pagination>
        </div>
      </template>
    </Tab>

    <Dialog :visible="visible" :title="title" @show="show" @submit="submit">
      <template>
        <div v-if="title == '删除'">您确定要删除吗？</div>

        <div v-else-if="title == '确认最终方案'" v-html="switchContent"> </div>


        <div v-else>
          <el-form ref="form" :rules="rules" :model="form" label-width="117px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="设施名称:" prop="buildVo.buildId">
                  <el-select v-model="form.buildVo.buildId" placeholder="请选择设施" :disabled="title == '新增' ? false : true"
                    default-first-option @change="techConductAllowProjectPage
                      ">
                    <div class="option">
                      <el-option v-for="item in parentArr" :key="item.buildId" :label="item.buildName"
                        :value="item.buildId"></el-option>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="项目名称:" prop="structureProjectVo.projectId">
                  <el-select v-model="form.structureProjectVo.projectId" placeholder="请选择项目"
                    :disabled="title == '新增' ? false : true" default-first-option>
                    <div class="option">
                      <el-option v-for="item in childArr" :key="item.projectId" :label="item.projectName"
                        :value="item.projectId"></el-option>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="代实施方案:" prop="conductName">
                  <el-input v-model="form.conductName" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="法人代表:" prop="legalPerson">
                  <el-input v-model="form.legalPerson" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="公司名称:" prop="comName">
                  <el-input v-model="form.comName" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="起草时间:" prop="time">
                  <el-input v-model="form.time" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="文件编号:" prop="fileNum">
                  <el-input v-model="form.fileNum" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工程号:" prop="proNum">
                  <el-input v-model="form.proNum" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="子项号或系统号:" prop="sysNum">
                  <el-input v-model="form.sysNum" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="子项或系统名称:" prop="sysName">
                  <el-input v-model="form.sysName" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="图册(文件)名称:" prop="atlasName">
                  <el-input v-model="form.atlasName" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="图册(文件)序号:" prop="atlasNum">
                  <el-input v-model="form.atlasNum" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="工种:" prop="jobs">
                  <el-input v-model="form.jobs" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="批准:" prop="approve">
                  <el-input v-model="form.approve" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="审批人:" prop="shenPi">
                  <el-input v-model="form.shenPi" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="校对人:" prop="proofreaders">
                  <el-input v-model="form.proofreaders" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="审定人:" prop="shenDing">
                  <el-input v-model="form.shenDing" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="编制人:" prop="preparers">
                  <el-input v-model="form.preparers" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="审核人:" prop="reviewer">
                  <el-input v-model="form.reviewer" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工程咨询证书:" prop="proCertificate">
                  <el-input v-model="form.proCertificate" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="工程咨询单位:" prop="cooperativeCom">
                  <el-input v-model="form.cooperativeCom" :maxlength="20" show-word-limit></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="备注:" prop="note">
              <el-input type="textarea" v-model="form.note" maxlength="50" show-word-limit></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import {
  techConductAdd as add,
  techConductDelete as deleteFn,
  techConductUpdate as update,
  techConductPage as requestFn,
  techConductUpdateFinalFlag,
  // 获取已批准的所有项目
  techConductAllowBuildPage,
  // 获取已批准的所有项目
  techConductAllowProjectPage,
} from "../../utils/api";
import Nav from "../../components/Nav";
import Tab from "../../components/Tab";
import Dialog from "@/components/Dialog";
import moment from "moment";
export default {
  name: "programme",
  components: {
    Nav,
    Tab,
    Dialog,
  },
  data() {
    return {

      title: "",
      nav: [
        {
          name: "技术管理",
          path: "/technology",
          isClick: false,
        },
        {
          name: "代实施方案",
          path: "/programme",
          isClick: false,
        },
      ],

      // 已批准项目请求
      approvalReq: {
        data: "",
        page: 1,
        limit: 10000,
      },
      // 已批准请求
      childApprovalReq: {
        data: "",
        page: 1,
        limit: 10000,
      },
      // 已批准项目数组
      parentArr: [],
      // 已批准项目数组
      childArr: [],
      // 显示表格内容
      tableData: [],
      headerList: {
        "buildVo.areaName": "片区名称",
        "buildVo.buildName": "设施名称",
        "structureProjectVo.projectName": "项目名称",
        conductName: "代实施方案",
        "fkCreator.accountName": "创建用户",
        createTime: "创建时间",
      },
      // 请求数据
      request: {
        data: {
          areaName: "",
          buildName: "",
          projectName: "",
          conductName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },

      // 编辑中项目名中转仓
      cpid: "",
      // +｜/
      visible: false,
      title: "",

      // 表单数据
      form: {
        buildVo: {
          buildId: "",
        },
        structureProjectVo: {
          projectId: "",
        },
        conductName: "",
        legalPerson: "",
        comName: "",
        time: "",
        fileNum: "",
        proNum: "",
        sysNum: "",
        sysName: "",
        atlasName: "",
        atlasNum: "",
        jobs: "",
        approve: "",
        shenPi: "",
        proofreaders: "",
        shenDing: "",
        preparers: "",
        reviewer: "",
        proCertificate: "",
        cooperativeCom: "",
        note: "",
      },

      // switch
      projectId: "",
      conductId: "",
      finalFlag: "",
      // 弹框显示
      areaName: "",
      projectName: "",
      projectName: "",
      conductName: "",

      rules: {
        "buildVo.buildId": [
          { required: true, message: "设施名称不能为空", trigger: "blur" },
        ],
        "structureProjectVo.projectId": [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        conductName: [
          { required: true, message: "文档名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.requestFn();
    this.techConductAllowBuildPage();
  },
  methods: {
    // 获取表格数据
    async requestFn() {
      let res = await requestFn(this.request);
      if (res) {
        this.tableData = res.data.data.list;
        this.tableData.map((val, index) => {
          //只保留日期部分
          val.createTime = moment(val.createTime).format("YYYY-MM-DD");
          return val;
        });

        this.request.limit = res.data.data.pageSize;
        this.request.page = res.data.data.pageNum;
        this.request.total = res.data.data.total;
      }
    },
    // 获取已批准的项目列表
    async techConductAllowBuildPage() {
      const res =
        await techConductAllowBuildPage(
          this.approvalReq
        );
      if (res) this.parentArr = res.data.data.list;
    },
    // 获取已批准的项目列表
    async techConductAllowProjectPage(e) {
      this.childApprovalReq.data = e;
      const res =
        await techConductAllowProjectPage(
          this.childApprovalReq
        );
      this.form.structureProjectVo.projectId = "";
      if (res) this.childArr = res.data.data.list;
      //
    },
    addOrUpdateOrDelete(title, row) {
      this.title = title
      this.show();
      if (this.title == '删除') return this.deleteValue = row.conductId
      if (row) {
        this.$nextTick(() => {
          this.cpid = row.structureProjectVo.projectId;
          let temp = _.cloneDeep(row)
          temp.structureProjectVo.projectId =
            temp.structureProjectVo.projectName;
          this.form = temp
        });
      }
    },
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
          conductId: this.deleteValue,
        });
        this.show();
      } else if (this.title == '确认最终方案') {
        await techConductUpdateFinalFlag({
          projectId: this.projectId,
          conductId: this.conductId,
          finalFlag: this.finalFlag,
        });
        this.show();
      }
      else {
        // 表单新增与编辑
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (this.title == "新增") {
              await add(this.form);
            } else {
              this.form.structureProjectVo.projectId = this.cpid;
              await update(this.form);
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

    // 改变switch状态 techConductUpdateFinalFlag
    async switchValueChange(e, row) {
      this.title = "确认最终方案";
      this.areaName = row.buildVo.areaName;
      this.buildName = row.buildVo.buildName;
      this.projectName = row.structureProjectVo.projectName;
      this.projectId = row.structureProjectVo.projectId;
      this.conductId = row.conductId;
      this.conductName = row.conductName;
      this.finalFlag = e ? 1 : 0

      this.switchContent = e ? `
        <div>如果开启此项目下的代实施方案为最终文档，会造成同项目下的其他代实施方案关闭开启状态，
          <br />
          并且关于其他代实施方案的文档内容会进行清空处理。
          <br /><br />
          您确定要开启
          <b>${this.areaName}</b>-<b>${this.projectName}</b>-<b>${this.projectName}</b>-<b>${this.conductName}</b>
          为最终方案？
        </div>`: `关闭此代实施方案会
          <b>清空</b>
          此方案下所属资料,您确认要这样做吗`
      this.finalFlag = e ? 1 : 0
      this.visible = !this.visible;
    },

    //编辑文档
    editWord(row) {
      localStorage.setItem(
        "buildId",
        row.buildVo.buildId
      );
      localStorage.setItem(
        "projectId",
        row.structureProjectVo.projectId
      );
      localStorage.setItem("conductId", row.conductId);
      localStorage.setItem(
        "projectName",
        row.buildVo.areaName +
        "-" +
        row.buildVo.projectName +
        "-" +
        row.structureProjectVo.projectName
      );
      this.$router.push({
        path: "/programmeText",
      });
    },

    //切换条数
    handleSizeChange(val) {
      this.request.limit = val;
      this.requestFn();
    },

    //切换页数
    handleCurrentChange(val) {
      this.request.page = val;
      this.requestFn();
    },
    // 搜索
    search() {
      this.request.page = 1;
      this.requestFn();
    },
  },
};
</script>

<style scoped></style>