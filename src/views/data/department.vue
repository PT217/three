
<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="部门管理列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input placeholder="请输入部门名称" v-model="request.data" size="mini" clearable @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="操作" width="200px" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>

    <Dialog :title="title" :visible="visible" @show="show" @submit="submit">
      <template>
        <div v-if="title == '删除'">您确定要删除吗？</div>
        <el-form v-else ref="form" :model="form" :rules="rules" label-width="117px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门名称:" prop="departName">
                <el-input v-model.trim="form.departName" show-word-limit maxlength="10"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="部门描述:" prop="departDesc">
                <el-input v-model.trim="form.departDesc" show-word-limit maxlength="10"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </Dialog>
  </div>
</template>

<script>
import { mixins } from "../../mixin";
import {
  departAdd as add,
  departUpdate as update,
  departFindAll as requestFn,
  departDelete as deleteFn,
} from "../../utils/api";
export default {
  mixins: [mixins],
  data() {
    return {
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "项目人员管理",
          path: "/projectPersonnel",
          isClick: false,
        },
        {
          name: "部门管理",
          path: "/department",
          isClick: false,
        },
      ],
      pathList: [],
      headerList: {
        departName: "部门名称",
        departDesc: "部门描述",
      },
      // 表格数据请求
      request: {
        data: "",
        page: 1,
        limit: 5,
        total: 5,
      },
      visible: false,
      title: "",
      deleteValue: "",

      form: {
        departName: "",
        departDesc: "",
      },

      rules: {
        "departName": [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);

    },
    async add() {
      return await add(this.form);
    },
    async update() {
      return await update(this.form);
    },
    async deleteFn() {
      return await deleteFn({
        departId: this.deleteValue,
      });
    },

    addOrUpdateOrDelete(title, row) {
      this.show();
      this.title = title;
      if (title == "删除") {
        this.deleteValue = row.departId;
      }
      if (title == "编辑")
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
        });
    },
  },
};
</script>