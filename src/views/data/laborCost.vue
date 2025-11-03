<template>
  <div>
    <Nav :nav="nav"></Nav>
    <Tab title="人工费管理列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input clearable type="primary" size="mini" @input="inputFn" v-model="request.data.costName"
              placeholder="请输入费用名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="操作" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>
    <Dialog :visible="visible" :title="title" @submit="submit" @show="show">
      <el-form ref="form" :model="form" :rules="rules" label-width="117px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="通胀系数(%):" prop="payCoefficient">
              <el-input placeholder="请输入通胀系数" v-model="form.payCoefficient" @input="input('payCoefficient', $event)"
                show-word-limit maxlength="5"></el-input>
            </el-form-item>
          </el-col>
          <!-- payCoefficient -->
          <el-col :span="12">
            <el-form-item label="费用单价:" prop="basePayPrice">
              <el-input placeholder="请输入费用单价" v-model="form.basePayPrice" @input="input('basePayPrice', $event)"
                show-word-limit maxlength="10"></el-input>
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
import {
  dataParamLabor_costPayTable as requestFn,
  dataParamLabor_costUpdate as update,
} from "../../utils/api";
export default {
  data() {
    return {
      title: "人工费管理列表",
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

      loading: true,

      headerList: {
        costId: "费用编码",
        costName: "费用名称",
        price: "费用单价(元)",
        costUnit: "费用单位",
        paramCoefficient: "通胀率",
        comment: "备注",
      },
      tableData: [],
      request: {
        data: {
          costName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },

      // 编辑
      title: "",
      visible: false,
      form: {
        payPriceCode: "",
        payCoefficient: "",
        basePayPrice: "",
      },

      // 校验
      rules: {
        payCoefficient: [
          { required: true, message: "通胀系数不能为空", trigger: "blur" },
        ],
        basePayPrice: [
          { required: true, message: "费用单价不能为空", trigger: "blur" },
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

    addOrUpdateOrDelete(title, row) {
      console.log(row);
      this.show();
      this.title = title;
      if (title == "编辑") {
        this.$nextTick(() => {
          this.form.payPriceCode = row.costId;
          this.form.basePayPrice = row.price;
          this.form.payCoefficient = Number(
            row.paramCoefficient.substring(0, row.paramCoefficient.indexOf("%"))
          );
        });
      }
    },
    show() {
      if (this.visible && this.title != "删除") this.$refs.form.resetFields();
      this.visible = !this.visible;
    },

    submit() {
      let res;
      switch (this.title) {
        case "":
          break;
        default:
          this.$refs.form.validate(async (valid) => {
            if (valid) {
              if (this.title == "新增") res = "";
              else res = await update(this.form);
              this.show();
              this.requestFn();
            } else {
              this.$message({
                offset: 170,
                duration: "1000",
                message: "校验未通过，请检查您输入的内容",
                type: "warning",
              });
            }
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
      if (e) this.requestFn("reset");
    },
    input(key, e) {
      // 检验只能输入数字且保留小数点后两位

      // console.log();

      this.form[key] = e.match(/^\d*(\.?\d{0,2})/g)[0]

    },
  },
};
</script>
