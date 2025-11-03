<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab title="基本参数管理列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form :inline="true">
          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model.number="request.data.payCoefficient"
              placeholder="请输入参数系数"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data.note" placeholder="请输入参数名称"></el-input>
          </el-form-item>

          <el-form-item><el-button type="primary" size="mini" @click.prevent="search()">搜索</el-button></el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
      <Dialog :visible="visible" :title="title" @show="show" @submit="submit">
        <el-form ref="form" :model="form" :rules="rules" label-width="117px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="编码:" prop="paramCode">
                <el-input v-model="form.paramCode" :disabled="this.title == '新增' ? false : true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12" prop="note">
              <el-form-item label="参数名称:">
                <el-input v-model="form.note" :disabled="this.title == '新增' ? false : true"></el-input>
              </el-form-item></el-col>

            <el-col :span="12">
              <el-form-item label="参数系数(%):" prop="payCoefficient">
                <el-input v-model="form.payCoefficient" @input="input('payCoefficient', $event)" show-word-limit
                  maxlength="9"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注:" prop="description">
                <el-input type="textarea" v-model="form.description" maxlength="50" show-word-limit></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </Dialog>
    </Tab>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Dialog from "@/components/Dialog.vue";
import {
  dataReportUpdate as update,
  dataReportPage as requestFn,
} from "../../utils/api";
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
          name: "退役申报基本参数管理",
          path: "/retirementDeclaration",
          isClick: false,
        },
        {
          name: "工作流目录",
          path: "/workflow",
          isClick: false,
        },
        {
          name: "退役成本",
          path: "/retireCost",
          isClick: false,
        },
        {
          name: "退役报表",
          path: "/parameter",
          isClick: false,
        },
        {
          name: "人工费",
          path: "/laborCost",
          isClick: false,
        },
      ],
      tableData: [],
      loading: true,
      headerList: {
        paramCode: "编码",
        note: "参数名称",
        payCoefficient: "参数系数",
        "fkCreator.accountName": "创建人",
        createTime: "创建时间",
        description: "参数备注",
      },
      request: {
        data: {
          payCoefficient: "",
          note: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },
      title: "",
      visible: false,

      form: {
        paramCode: "",
        note: "",
        payCoefficient: "",
        description: "",
      },
      rules: {
        payCoefficient: [
          { required: true, message: "支付系数不能为空", trigger: "blur" },
        ],
        description: [
          { required: true, message: "备注不能为空", trigger: "blur" },
        ],
      },
    };
  },
  components: {
    Nav,
    Tab,
    Dialog,
  },
  created() {
    this.requestFn();
  },
  methods: {
    async requestFn() {
      const res = await requestFn(this.request);
      if (res) {
        this.tableData = res.data.data.list;
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
      }
      this.loading = false;
    },
    show() {
      if (this.visible) {
        this.$refs["form"].resetFields();
      }
      this.visible = !this.visible;
    },
    addOrUpdateOrDelete(title, row) {
      this.show();
      this.title = title;
      if (title == "编辑") {
        console.log(row);
        this.form = Object.assign({}, row);
        this.form.payCoefficient = Number(
          this.form.payCoefficient.substring(
            0,
            this.form.payCoefficient.indexOf("%")
          )
        );
      }
    },

    //搜索
    search() {
      this.request.page = 1;
      this.requestFn();
    },
    //切换页数
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    //切换条数
    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    submit() {
      switch (this.title) {
        case "":
          break;
        default:
          this.$refs["form"].validate(async (valid) => {
            if (valid) {
              this.form.payCoefficient += "%";
              const res = await update(this.form);

              this.show();
              this.requestFn();
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
    inputFn(e) {
      if (!e) this.requestFn();
    },
    input(key, e) {
      this.form[key] = e.match(/^\d*(\.?\d{0,2})/g)[0];
    },
  },
};
</script>