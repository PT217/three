<template>
  <div class="proDecompose">
    <Nav :nav="nav"></Nav>

    <Tab title="工程结构分解列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data.areaName"
              placeholder="请输入片区名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data.buildName"
              placeholder="请输入设施名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" v-model="request.data.projectName" placeholder="请输入项目名称" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" v-model="request.data.structureName" placeholder="请输入工程结构分解名" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button v-has="{ action: '/structure/add', effect: 'disabled' }" type="primary" size="mini"
              @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="批准" align="left">
          <template slot-scope="scope">
            <el-switch v-has="{
              action: '/tech/structure/changeFlag',
              effect: 'disabled',
            }" v-model="scope.row.structureFlag" :inactive-value="0" :active-value="1"
              @change="addOrUpdateOrDelete('批准', scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250px" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('go', scope.row)">设计</el-button>
            <el-button v-has="{
              action: '/tech/structure/update',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
            <el-button v-has="{
              action: '/tech/structure/deleteById',
              effect: 'disabled',
            }" type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>

    <Dialog :visible="visible" :title="title" @show="show" @submit="submit">
      <template>
        <div v-if="title == '删除'">您确定要删除吗？</div>

        <div v-else-if="title == '批准'">
          是否{{
            switchVo.structureFlag ? "批准" : "关闭"
          }}此工程解构分解？
        </div>

        <el-form v-else ref="form" :model="form" :rules="rules" label-width="117px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="设施名称:" prop="build.projectId">
                <el-select v-model="form.build.buildId" placeholder="请选择设施名" @change="childListFn"
                  :disabled="title == '新增' ? false : true" default-first-option>
                  <div class="option">
                    <el-option v-for="item in parentList" :key="item.buildId" :label="item.buildName"
                      :value="item.buildId"></el-option>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="项目名称:" prop="project.projectId">
                <el-select v-model="form.project.projectId" placeholder="请选择项目" :disabled="title == '新增' ? false : true">
                  <div class="option">
                    <el-option v-for="item in childList" :key="item.projectId" :value="item.projectId"
                      :label="item.projectName"></el-option>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="工程结构分解:" prop="structureName">
                <el-input maxlength="10" show-word-limit v-model="form.structureName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </Dialog>
  </div>
</template>

<script>
import {
  techStructureAdd as add,
  structureUpdate as update,
  structureQueryByLimit as requestFn,
  structureDeleteById as deleteFn,
  // 批准
  structureChangeFlag as switchFn,
  // 所有项目
  prjProjectGetBuildList as parentListFn,
  // 获取项目列表
  prjProjectFindApprovedProjectList as childListFn,
} from "../../utils/api";
import { mixins } from "../../mixin";
export default {
  mixins: [mixins],
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
      ],
      // 显示表格内容
      headerList: {
        "build.areaName": "片区名称",
        "build.buildName": "设施名称",
        "project.projectName": "项目名称",
        structureName: "工程结构分解名称",
        "creator.accountName": "创建人",
        createTime: "创建时间",
      },
      request: {
        data: {
          areaName: "",
          buildName: "",
          projectName: "",
          structureName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },

      // 查询所有项目
      parentListFnRequest: {
        data: "",
        page: 1,
        limit: 1000,
      },
      parentList: [],
      childList: [],

      title: "",
      visible: false,
      deleteValue: "",

      switchVo: {
        projectId: "",
        structureId: "",
        structureFlag: "",
      },
      form: {
        build: {
          buildId: "",
        },
        project: {
          projectId: "",
        },
        structureName: "",
      },
      rules: {
        "build.buildId": [
          { required: true, message: "设施名称不能为空", trigger: "blur" },
        ],
        "project.projectId": [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        structureName: [
          {
            required: true,
            message: "工程结构分解名称不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.parentListFn();
  },
  methods: {
    // 获取表格数据
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);

    },
    // 获取项目列表
    async parentListFn() {
      let res = await parentListFn(this.parentListFnRequest);

      if (res) this.parentList = res.data.data.list;
    },
    // 获取项目列表
    async childListFn(id) {
      this.form.project.projectId = ""
      const res = await childListFn({
        buildId: id,
      });
      if (res) this.childList = res.data.data;
    },
    async add() {
      return await add(this.form);
    },
    async update() {
      return await update(this.form);
    },
    async deleteFn() {
      return await deleteFn({
        structureId: this.deleteValue,
      });
    },
    async switchFn() {
      return await switchFn(this.switchVo);
    },
    // 按钮事件
    addOrUpdateOrDelete(title, row) {
      console.log(row);
      if (title == "go") {
        this.$router.push({
          path: "/flowChart",
        });
        localStorage.setItem(
          "structureId",
          row.structureId
        );
        localStorage.setItem(
          "buildName",
          row.build.areaName +
          "-" +
          row.build.buildName +
          "-" +
          row.project.projectName
        );
        return;
      }
      this.childList = [];
      this.title = title;
      this.show();

      if (title == "编辑")
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
        });
      if (title == "批准")
        this.switchVo = {
          projectId: row.project.projectId,
          structureId: row.structureId,
          structureFlag: row.structureFlag
        };
      if (title == "删除") this.deleteValue = row.structureId;
    },
  },
};
</script>
