<!--
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-09-07 09:29:33
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2022-10-27 13:47:00
 * @FilePath: /NDP/chengwei/src/views/data/path.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="路径管理列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" v-model="request.data" placeholder="请输入路径名称"></el-input>
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
              <el-form-item label="路径名称:" prop="permName">
                <el-input v-model.trim="form.permName" show-word-limit maxlength="80"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="路径链接:" prop="link">
                <el-input v-model.trim="form.link" show-word-limit maxlength="80"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="类型:" prop="type">
                <el-select v-model="form.type">
                  <el-option value="m" label="页面"> </el-option>
                  <el-option value="a" label="按钮"> </el-option>
                </el-select>
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
  permAdd as add,
  permUpdate as update,
  permPage as requestFn,
  permDelete as deleteFn,
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
          name: "路径管理",
          path: "/path",
          isClick: false,
        },
      ],
      headerList: {
        permName: "路径名称",
        link: "路径链接",
        type: "类型",
      },
      request: {
        data: "",
        page: 1,
        limit: 5,
        total: 5,
      },

      title: "",
      visible: false,
      deleteValue: "",

      form: {},
      rules: {
        permName: [
          { required: true, message: "路径名称不能为空", trigger: "blur" },
        ],
        link: [
          { required: true, message: "路径链接不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    // 获取表格数据
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);

    },

    // 新增与编辑
    addOrUpdateOrDelete(title, row) {
      this.show();
      this.title = title;
      if (title == "删除") {
        this.deleteValue = row.permId;
      }
      if (title == "编辑") {
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
          this.form.type = this.form.type == "页面" ? "m" : "a";
        });
      }
    },
    async add() {
      return await add(this.form);
    },
    async update() {
      return await update(this.form);
    },
    async deleteFn() {
      return await deleteFn({
        permId: this.deleteValue,
      });
    },
  },
};
</script>