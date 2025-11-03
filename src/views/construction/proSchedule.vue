<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab title="施工进度列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" v-model="request.data.areaName"
              placeholder="请输入片区名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" v-model="request.data.buildName"
              placeholder="请输入设施名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" v-model="request.data.projectName"
              placeholder="请输入项目名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" v-model="request.data.conductName"
              placeholder="请输入方案名称"></el-input>
          </el-form-item>

          <el-form-item><el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button></el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="操作" width="150px" align="left">
          <template slot-scope="scope">
            <el-button v-has="{ action: '/const/final_scheme/getGantt' }" type="primary" size="mini"
              @click="addOrUpdateOrDelete('编辑', scope.row)">管理</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import Tab from "../../components/Tab";
import { finalSchemeFindAll as requestFn, backLogGetLeaderFlagByAccountId } from "../../utils/api";
export default {
  components: {
    Nav,
    Tab,
  },
  data() {
    return {
      nav: [
        {
          name: "施工管理",
          path: "/construction",
          isClick: false,
        },
        {
          name: "施工进度",
          path: "/proSchedule",
          isClick: false,
        },
      ],
      loading: true,

      headerList: {
        areaName: "片区名称",
        buildName: "设施名称",
        projectName: "项目名称",
        finalSchemeName: "方案名称",
        accountName: "创建用户",
        createTime: "创建时间",
      },
      tableData: [],
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
    };
  },
  created() {
    this.requestFn();
  },
  methods: {
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) {
        this.tableData = res.data.data.list;
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
      }
      this.loading = false;
    },
    async addOrUpdateOrDelete(title, row) {
      if (title == "编辑") {
        localStorage.setItem("finalSchemeId", row.finalSchemeId);

        this.$store.dispatch('FETCH_ACCOUNT')

        localStorage.setItem("projectName", row.buildName);
        localStorage.setItem("areaName", row.areaName);
        this.$router.push({
          name: "gant",
          params: { refresh: true, id: row.finalSchemeId },
        });
      }
    },

    //分页条数改变
    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    //当前页改变
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    inputFn(e) {
      if (!e) this.requestFn("reset");
    },
  },
};
</script>