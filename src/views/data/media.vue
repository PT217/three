<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="多媒体库列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data.areaName"
              placeholder="请输入片区名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" v-model="request.data.buildName"
              placeholder="请输入设施名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input size="mini" clearable @input="inputFn" placeholder="请输入文件名称"
              v-model="request.data.fileName"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button v-has="{ action: '/data/multimedia/add', effect: 'disabled' }" type="primary" size="mini"
              @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button @click="addOrUpdateOrDelete('播放', scope.row)" type="primary" size="mini">播放</el-button>
            <el-button v-has="{
              action: '/data/multimedia/update',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
            <el-button v-has="{
              action: '/data/multimedia/delete',
              effect: 'disabled',
            }" type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>

    <Dialog :visible="visible" :title="title" @submit="submit" @show="show" :showBtn="!title.includes('播放')">
      <div v-if="title == '删除'">你确定要删除吗？</div>
      <div v-else-if="title.includes('播放')">
        <!-- <video ref="video" src="../../assets/audio/test.mp4" controls autoplay muted width="100%" height="100%" /> -->
        <video ref="video" :src="form.path" controls autoplay muted width="100%" height="100%" />
        <!-- <source :src="form.path" type="video/mp4" /> -->
      </div>
      <el-form v-else ref="form" :rules="rules" :model="form" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="片区名称:" prop="areaName">
              <el-input v-model="form.areaName" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="设施名称:" prop="buildName">
              <el-input v-model="form.buildName" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="文件名称:" prop="fileName" :error="errormsg">
              <el-input v-model="form.fileName" @blur="dataMultimediaGetAllFileName" show-word-limit
                maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注:" prop="note">
              <el-input type="textarea" v-model="form.note" show-word-limit maxlength="50"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item v-show="title == '编辑' ? false : true" label="文件上传:" prop="mediaMergeName">
              <LargeFileCutting ref="LargeFileCutting" @complete="complete" :inputFile="form.mediaMergeName"
                url="data/multimedia/chunk" accept="video/*" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Dialog from "@/components/Dialog.vue";
import LargeFileCutting from "../../components/LargeFileCutting.vue";
import {
  dataMultimediaAdd as add,
  dataMultimediaUpdate as update,
  dataMultimediaPage as requestFn,
  dataMultimediaDelete as deleteFn,
  // 判断媒体文件名是否重复
  dataMultimediaGetAllFileName,
} from "../../utils/api";
export default {
  components: {
    Nav,
    Tab,
    Dialog,
    LargeFileCutting,
  },
  data() {
    return {
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "多媒体库",
          path: "/media",
          isClick: false,
        },
      ],
      loading: true,
      headerList: {
        areaName: "片区名称",
        buildName: "设施名称",
        fileName: "文件名称",
        "creator.accountName": "创建人",
        createTime: "创建时间",
      },
      tableData: [],
      request: {
        data: {
          buildName: "",
          fileName: "",
          areaName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },

      title: "",
      visible: false,
      deleteValue: "",

      form: {
        path: "",
        areaName: "",
        buildName: "",
        fileName: "",
        note: "",
        hash: "",
        mediaMergeName: "",
      },
      mediaVideoPlayStatus: false,

      errormsg: "",

      rules: {
        buildName: [
          { required: true, message: "项目名不能为空", trigger: "blur" },
        ],
        areaName: [
          { required: true, message: "片区名不能为空", trigger: "blur" },
        ],
        fileName: [
          { required: true, message: "文件名不能为空", trigger: "blur" },
        ],

        note: [{ required: true, message: "备注不能为空", trigger: "blur" }],
        mediaMergeName: [
          {
            required: true,
            message: "必传文件不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.requestFn();
  },
  methods: {
    // 获取表格数据
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
    //判断项目名是否重复
    async dataMultimediaGetAllFileName() {
      // this.errormsg = "";
      // let res
      // if (this.title == '新增') {
      //   res = await dataMultimediaGetAllFileName({
      //     multimediaName: this.form.fileName,
      //   });
      // } else {
      //   res = await dataMultimediaGetAllFileName({
      //     multimediaName: this.form.fileName,
      //     multiId: this.form.multiId
      //   });
      // }
    },

    addOrUpdateOrDelete(title, row) {
      console.log(row);
      this.show();
      this.title = title;
      if (title == "编辑") {
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
          this.form["mediaMergeName"] = row.buildName;
        });
      }
      if (title == "播放") {
        this.$nextTick(() => {
          this.form.path = row.path;
          this.$refs.video.currentTime = 0;
          this.title +=
            ":" + row.areaName + "-" + row.buildName + "-" + row.fileName;
        });
      }
      if (title == "删除") {
        this.deleteValue = row.multiId;
      }
    },
    // 弹框
    show() {
      if (this.visible && (this.title == "新增" || this.title == "编辑")) {
        if (this.title == "新增") {
          this.$refs.LargeFileCutting.clear();
        }
        this.$refs["form"].resetFields();
      }
      if (this.visible && this.title.includes("播放")) {
        this.$refs.video.pause();
      }

      this.visible = !this.visible;
    },
    async submit() {
      let res;
      switch (this.title) {
        case "删除":
          this.request.total--;
          if (
            this.request.page > 1 &&
            this.request.total % this.request.limit == 0
          )
            this.request.page--;
          res = await deleteFn({
            multiId: this.deleteValue,
          });
          this.show();
          this.requestFn();
          break;
        default:
          this.$refs.form.validate(async (valid) => {
            if (valid) {
              if (this.title == "新增") {
                res = await add(this.form);
              } else {
                res = await update(this.form);
              }
              this.show();
              this.requestFn();
            }
            else this.$message({
              offset: 170,
              duration: "1000",
              message: "未通过校验，请按表单中的提示修改",
              type: "warning",
            });
          });
      }
    },

    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    inputFn(e) {
      if (!e) this.requestFn("reset");
    },
    // 完整
    complete(data) {
      console.log(data);
      this.form.mediaMergeName = data.fileName;
      this.form.hash = data.hash;
    },
  },
};
</script>

<style scoped></style>