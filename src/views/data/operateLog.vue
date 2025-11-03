<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab title="操作日志列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input clearable type="primary" size="mini" @input="inputFn" v-model="request.data"
              placeholder="请输入用户名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>
    </Tab>
  </div>
</template>

<script>
import { mixins } from "../../mixin";
import { dataLog_operatePage as requestFn } from "../../utils/api";
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
          name: "操作日志",
          path: "/operateLog",
          isClick: false,
        },
      ],
      headerList: {
        accountName: "用户名称",
        accessPath: "访问路径",
        ip: "IP地址",
        accessTime: "访问时间",
      },
      request: {
        data: "",
        page: 1,
        limit: 5,
        total: 5,
      },
    };
  },
  created() { },
  methods: {
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);
    },
  },
};
</script>