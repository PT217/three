
<template>
  <div>
    <Nav :nav="nav">
      <template slot="right">
        <el-button type="primary" size="mini" @click="ndpProManageSee()"
          >挂图作战</el-button
        >
      </template>
    </Nav>
    <Tab
      title="核退役设施"
      :tableData="tableData"
      :headerList="headerList"
      @pageChange="pageChange"
      @limitChange="limitChange"
      :request="request"
      :loading="loading"
    >
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input
              clearable
              size="mini"
              @input="inputFn"
              v-model="request.data.areaName"
              placeholder="请输入片区名称"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-input
              clearable
              size="mini"
              @input="inputFn"
              v-model="request.data.buildName"
              placeholder="请输入设施名称"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('搜索')"
              >搜索</el-button
            >
          </el-form-item>

          <el-form-item>
            <el-button
              v-has="{ action: '/prj/build/add', effect: 'disabled' }"
              type="primary"
              size="mini"
              @click="addOrUpdateOrDelete('新增')"
              >新增</el-button
            >
          </el-form-item>
        </el-form>
      </template>
      <template slot="column">
        <el-table-column label="操作" width="250px" align="left">
          <template slot-scope="scope">

            <el-button type="primary" size="mini" @click="ndpProManageSee(scope.row)">查看</el-button>
            <el-button type="primary" size="mini" v-has="{ action: '/prj/build/update' }"
              @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
            <el-button type="primary" size="mini" v-if="scope.row.json" @click="cameraFn(scope.row)">监控</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>
    <Dialog :title="title" :visible="visible" @show="show" @submit="submit">
      <div v-if="title == '删除'">您确定要删除吗？</div>
      <el-form
        v-else
        ref="form"
        :model="form"
        :rules="rules"
        label-width="117px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item prop="areaName" label="片区名称:">
              <el-input
                maxlength="10"
                show-word-limit
                v-model="form.areaName"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="buildName" label="设施名称:">
              <el-input
                maxlength="10"
                show-word-limit
                v-model="form.buildName"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="principalName" label="负责人:">
              <el-input
                v-model="form.principalName"
                maxlength="10"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="investmentAmount" label="投资金额:">
              <el-input v-model="form.investmentAmount"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="typeInfo.typeInnerCode" label="退役类型:">
              <el-select
                v-model="form.typeInfo.typeInnerCode"
                placeholder="请选择退役类型"
                class="sel"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.typeInnerCode"
                  :value="item.typeInnerCode"
                  :label="item.typeOuterCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="comment" label="备注:">
          <el-input
            type="textarea"
            v-model="form.comment"
            show-word-limit
            maxlength="50"
          ></el-input>
        </el-form-item>

        <div style="overflow: scroll; overflow-x: hidden; height: 300px">
          <el-form-item
            v-for="(item, i) in form.buildStatusList"
            :key="i"
            :label="item.statusInfo.statusOuterCode + ':'"
            style="backgroundcolor: #f8f9fb"
          >
            <el-row>
              <el-col :span="12">
                <el-row>
                  <el-form-item label="计划时间:">
                    <el-date-picker
                      v-model="item.planTestTime"
                      type="daterange"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions1"
                      @blur="disableTime()"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-row>
                <el-row style="padding: 5px 0">
                  <el-form-item label="实际时间:">
                    <el-date-picker
                      v-model="item.actualTestTime"
                      type="daterange"
                      unlink-panels
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions2"
                      @blur="disableTime()"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-row>
              </el-col>

              <el-col :span="10" style="padding-right: 30px">
                <el-form-item
                  label-position="left"
                  label="状态备注"
                  label-width="70px"
                  :prop="'buildStatusList.' + i + '.comment'"
                >
                  <el-input
                    show-word-limit
                    maxlength="20"
                    type="textarea"
                    v-model="form.buildStatusList[i].comment"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </el-form>
    </Dialog>
  </div>
</template>


<script>
import { mixins } from "../../mixin";
import {
  prjBuildAdd as add,
  prjBuildUpdate as update,
  prjBuildGetList as requestFn,
  prjBuildDelete as deleteFn,
  // 状态
  prjBuildStatusPage,
  // 类型
  prjBuildTypePage,
} from "../../utils/api";
export default {
  mixins: [mixins],
  data() {
    return {
      nav: [
        {
          name: "项目管理",
          path: "/project",
          isClick: false,
        },
        {
          name: "核退役设施",
          path: "/ndpProManage",
          isClick: false,
        },
      ],
      headerList: {
        areaName: "片区名称",
        buildName: "设施名称",
        "typeInfo.typeOuterCode": "退役类型",
        principalName: "负责人",
        investmentAmount: "投资金额（元）",
        "accountInfo.accountName": "创建人",
        createTime: "创建时间",
      },
      request: {
        data: {
          areaName: "",
          buildName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },

      title: "",
      visible: false,
      deleteValue: "",

      form: {
        buildId: "",
        buildName: "",
        principalName: "",

        typeInfo: {
          typeInnerCode: "",
        },
        buildStatusList: [],

        accountInfo: {
          accountId: "",
        },
        investmentAmount: "",
        areaName: "",
        comment: "",
      },

      CPbuildStatusList: {
        ndplStatusId: "",
        statusInfo: {
          statusInnerCode: "",
        },

        planStart: "",
        planEnd: "",
        actualStart: "",
        actualEnd: "",
        planTestTime: [],
        actualTestTime: [],
      },
      // 原状态
      cpStatusList: [],
      pickerOptions1: {
        disabledDate(time) {},
      },

      pickerOptions2: {
        disabledDate(time) {},
      },
      rules: {
        buildName: [
          { required: true, message: "请输入设施名称", trigger: "blur" },
        ],
        principalName: [
          { required: true, message: "请输入负责人", trigger: "blur" },
        ],
        investmentAmount: [
          {
            required: true,
            trigger: "blur",
            validator: this.validator,
          },
        ],
        areaName: [
          { required: true, message: "请输入片区名称", trigger: "blur" },
        ],
        "typeInfo.typeInnerCode": [
          { required: true, message: "请选择类型", trigger: "blur" },
        ],
      },
      typeList: {},
    };
  },

  created() {
    this.prjBuildStatusPage();
    this.prjBuildTypePage();
  },
  mounted() {},
  methods: {
    validator(rule, val, callback) {
      const re =
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

      if (!val) {
        callback();
      } else {
        let value = val + "";
        if (!re.test(value)) {
          callback(new Error("请输入数值型,可保留小数点后两位"));
        } else if (value.length > 12) {
          callback(new Error("包含小数点最多输入12位数"));
        } else if (value.indexOf(".") != -1 && value.split(".")[0].length > 9) {
          callback(new Error("小数点前最多输入9位数"));
        } else if (value.indexOf(".") == -1 && value.length > 9) {
          callback(new Error("整数最多输入9位数"));
        } else {
          callback();
        }
      }
    },
    // 获取数据
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);
    },
    // 获取状态
    async prjBuildStatusPage() {
      const res = await prjBuildStatusPage();
      console.log(res);
      if (res) {
        res.data.data.forEach((item) => {
          this.CPbuildStatusList.statusInfo = item;
          this.form.buildStatusList.push(_.cloneDeep(this.CPbuildStatusList));
          this.cpStatusList = this.form.buildStatusList;
        });
      }
    },
    // 获取类型
    async prjBuildTypePage() {
      const res = await prjBuildTypePage();
      if (res) this.typeList = res.data.data;
    },
    // 新增与编辑
    addOrUpdateOrDelete(title, row) {
      this.show();
      this.title = title;
      if (title == "新增") {
        this.form.buildStatusList.forEach((item) => {
          item.planTestTime = [];
          item.actualTestTime = [];
        });
      }
      if (title == "编辑") {
        this.$nextTick(() => {
          console.log(row);
          row.buildStatusList.forEach((item) => {
            item["planTestTime"] = [item.planStart, item.planEnd];
            item["actualTestTime"] = [item.actualStart, item.actualEnd];
            if (!item.planStart) {
              item["planTestTime"] = ["", ""];
            }
            if (!item.actualStart) {
              item["actualTestTime"] = ["", ""];
            }
          });
          this.form = _.cloneDeep(row);
        });
      }
      if (title == "删除") {
        this.deleteValue = row.buildId;
      }
      this.disableTime();
    },
    show() {
      if (this.visible && (this.title == "新增" || this.title == "编辑")) {
        this.$refs["form"].resetFields();
      }
      this.visible = !this.visible;
    },
    // 提交
    async submit() {
      let res;
      if (this.title == "删除") {
        res = await deleteFn({
          buildId: this.deleteValue,
        });
        this.show();
        this.requestFn();
      } else {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            this.changeVariable();
            if (this.title == "新增") res = await add(this.form);
            else res = await update(this.form);
            this.show();
            this.requestFn();
          }
        });
      }
    },
    // 查看全局挂图作战
    // ndpProManageSeeAll(row) {

    // },
    // 查看单个挂图作战
    ndpProManageSee(row) {
      row
        ? localStorage.setItem("buildId", row.buildId)
        : localStorage.removeItem("buildId");
      this.$router.replace({
        name: "wallChart2",
      });
    },
    //禁用时间（同一厂区，不同状态时间不可重复）
    disableTime() {
      this.changeVariable();
      //计划时间
      this.pickerOptions1 = Object.assign({}, this.pickerOptions1, {
        disabledDate: (time) => {
          const today = new Date().toLocaleDateString();
          let disable = time < new Date(today);
          this.form.buildStatusList.forEach((item) => {
            // debugger
            if (item.planEnd && item.planStart) {
              disable =
                disable ||
                (time.getTime() >
                  new Date(item.planStart).getTime() -
                    1 * 24 * 60 * 60 * 1000 &&
                  time.getTime() < new Date(item.planEnd).getTime());
            }
          });
          return disable;
        },
      });
      //实际时间
      this.pickerOptions2 = Object.assign({}, this.pickerOptions2, {
        disabledDate: (time) => {
          const today = new Date().toLocaleDateString();
          let disable = time < new Date(today);
          this.form.buildStatusList.forEach((item) => {
            if (item.actualStart && item.actualEnd) {
              disable =
                disable ||
                (time.getTime() >
                  new Date(item.actualStart).getTime() -
                    1 * 24 * 60 * 60 * 1000 &&
                  time.getTime() < new Date(item.actualEnd).getTime());
            }
          });
          return disable;
        },
      });
    },
    //将时间组件的变量赋值给后台需要的变量
    changeVariable() {
      this.form.buildStatusList.forEach((item) => {
        item.planTestTime = item.planTestTime ? item.planTestTime : ["", ""];
        item.actualTestTime = item.actualTestTime
          ? item.actualTestTime
          : ["", ""];
        if (item.actualTestTime.length != 0) {
          item.actualStart = item.actualTestTime[0];
          item.actualEnd = item.actualTestTime[1];
        } else {
          item.actualStart = "";
          item.actualEnd = "";
        }
        if (item.planTestTime.length != 0) {
          item.planStart = item.planTestTime[0];
          item.planEnd = item.planTestTime[1];
        } else {
          item.planStart = "";
          item.planEnd = "";
        }
      });
    },

    cameraFn(item) {
      localStorage.setItem('sceneData', JSON.stringify(item))
      this.$router.push({ path: '/monitor' })
    },
  },
};
</script>