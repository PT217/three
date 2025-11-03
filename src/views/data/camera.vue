<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab title="摄像头管理" :tableData="tableData" :headerList="headerList" @pageChange="pageChange" @limitChange="limitChange"
      :request="request" :loading="loading">
      <template slot="select">
        <el-form inline>

          <el-form-item>
            <el-input clearable size="mini" @input="e => e ? '' : req('r')" v-model="request.data.cameraName"
              placeholder="请输入摄像头名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="req('搜索')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="operate('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column width="200px" label="操作" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="operate('编辑', scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="operate('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>
    <Dialog :title="title" :visible="visible" @show="show" @submit="submit">
      <div v-if="title == '删除'">你确定要删除吗？</div>



      <el-form v-else ref="form" :model="form" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="设施名称:" prop="buildId">
              <el-select v-model="form.buildId" placeholder="请选择设施名" default-first-option>
                <el-option v-for="  item   in   buildList  " :key="item.buildId" :label="item.buildName"
                  :value="item.buildId"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="摄像头名称:" prop="cameraName">
              <el-input maxlength="10" show-word-limit v-model="form.cameraName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="摄像头地址:" prop="cameraUrl">
              <el-input maxlength="100" show-word-limit v-model="form.cameraUrl"></el-input>
            </el-form-item>
          </el-col>


        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>


<script>
import {
  prjProjectGetBuildList, //获取所有设施
  dataCameraPage as req,
  dataCameraAddCamera as add,
  dataCameraDeleteCamera as del,
  dataCameraUpdateCamera as update,
} from "../../utils/api";

import Nav from '../../components/Nav.vue'
import Tab from '../../components/Tab.vue'
import Dialog from '../../components/Dialog.vue'

export default {
  data() {
    return {
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "摄像头管理",
          path: "/camera",
          isClick: false,
        },
      ],
      headerList: {
        buildName: "设施名称",
        cameraName: "摄像头名称",
        cameraUrl: "摄像头地址",
      },
      tableData: [],
      loading: true,

      request: {
        data: {
          cameraName: ""
        },
        page: 1,
        limit: 5,
        total: 5,
      },

      buildList: [],

      title: "",

      visible: false,

      form: {
        cameraName: '',
        cameraUrl: '',
        buildId: null
      },

      rules: {
        buildName: [
          { required: true, message: "摄像头名称不能为空", trigger: "blur" },
        ],
        cameraUrl: [
          { required: true, message: "摄像头地址不能为空", trigger: "blur" },
        ],
      },
    };
  },

  components: {
    Nav,
    Tab,
    Dialog
  },

  created() {
    this.prjProjectGetBuildList()
    this.req()
  },
  mounted() { },
  methods: {
    // 获取表格数据
    async req(reset) {
      if (reset) this.request.page = 1;
      const res = await req(this.request);
      if (res) {
        this.tableData = res.data.data.list.map(item => ({
          buildId: item.buildId,
          buildName: item.buildName,
          cameraName: item.cameraName,
          cameraUrl: item.cameraUrl,
          cameraId: item.cameraId
        }))
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
      }
      this.loading = false;
    },
    // 获取设施数组
    async prjProjectGetBuildList() {
      const res = await prjProjectGetBuildList({
        data: "",
        page: 1,
        limit: 1000,
      });
      if (res) this.buildList = res.data.data.list
    },
    // 弹框
    show() {
      if (this.visible) {
        if (this.title == "新增" || this.title == "编辑") this.$refs["form"].resetFields();
        this.req()
        this.visible = false
      }
    },


    operate(title, row) {
      this.visible = true
      this.title = title;
      if (title != "新增") this.$nextTick(() => this.form = _.cloneDeep(row));
      else this.form = {
        cameraName: '',
        cameraUrl: '',
        buildId: null
      }
    },
    limitChange(limit) {
      this.request.limit = limit;
      this.req();
    },
    pageChange(page) {
      this.request.page = page;
      this.req();
    },
    // 提交
    async submit() {
      let res
      if (this.title == '删除') {
        res = await del({ cameraId: this.form.cameraId })
        if (!res) this.show()
      } else {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            if (this.title == '新增') res = await add(this.form)
            else res = await update(this.form)
            if (!res) this.show()
          }
        });
      }
    },
  },
};
</script>