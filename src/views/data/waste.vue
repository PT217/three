<template>
  <div class="waste">
    <Nav :nav="nav"></Nav>

    <Tab ref="tab" title="废物库列表" :tableData="tableData" :headerList="headerList" :request="request"
      @pageChange="pageChange" @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入片区名称" v-model="request.data.areaName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input placeholder="请输入设施名称" v-model="request.data.buildName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input placeholder="请输入废物名称" v-model="request.data.wasteName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" v-has="{
              action: '/data/waste/add',
              effect: 'disabled',
            }" size="mini" @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="expand">
        <el-table-column type="expand" width="1">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="所属系统:">
                <span>{{ props.row.belongSys }}</span>
              </el-form-item>

              <el-form-item label="废物类别:">
                <span>{{ props.row.wasteCategory }}</span>
              </el-form-item>

              <el-form-item label="设备功能:">
                <span>{{ props.row.deviceFunction }}</span>
              </el-form-item>

              <el-form-item label="材质:">
                <span>{{ props.row.materials }}</span>
              </el-form-item>

              <el-form-item label="数量:">
                <span>{{ props.row.nums }}</span>
              </el-form-item>

              <el-form-item label="重量:">
                <span>{{ props.row.weight }} {{ props.row.weightUnit }}</span>
              </el-form-item>

              <el-form-item label="余量:">
                <span v-if="props.row.margin">{{ props.row.margin }} {{ props.row.marginUnit }}</span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="外表面积:">
                <span v-if="props.row.outsideArea">{{ props.row.outsideArea }} {{ props.row.outsideAreaUnit }}
                </span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="内表面积:">
                <span v-if="props.row.innerArea">{{ props.row.innerArea }} {{ props.row.innerAreaUnit }}
                </span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="长度:">
                <span v-if="props.row.length">{{ props.row.length }} {{ props.row.lengthUnit }}
                </span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="废物来源:">
                <span>{{ props.row.wasteFrom }} </span>
              </el-form-item>
              <el-form-item label="放置状态:">
                <span>{{ props.row.placingState }} </span>
              </el-form-item>
              <el-form-item label="接触介质:">
                <span>{{ props.row.contactMedium }} </span>
              </el-form-item>
              <el-form-item label="介质来源:">
                <span>{{ props.row.mediumSource }} </span>
              </el-form-item>
              <el-form-item label="α射线计量:">
                <span v-if="props.row.alphaRays">{{ props.row.alphaRays }} {{ props.row.alphaUnit }}</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="β射线计量:">
                <span v-if="props.row.alphaRays">{{ props.row.alphaRays }} {{ props.row.betaUnit }}</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="γ射线计量:">
                <span v-if="props.row.gammaRays">{{ props.row.gammaRays }} {{ props.row.gammaUnit }}</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="锶同位素辐射计量:">
                <span v-if="props.row.srRadiation">{{ props.row.srRadiation }}
                  {{ props.row.srRadiationUnit }}</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="铯放射性元素辐射计量:">
                <span v-if="props.row.csRadiation">{{ props.row.csRadiation }}
                  {{ props.row.csRadiationUnit }}</span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="备注:">
                <span>{{ props.row.comment }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>

      <template slot="column">
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="toogleExpand(scope.row)">查看详情</el-button>
            <el-button v-has="{
              action: '/data/waste/update',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
            <el-button v-has="{
              action: '/data/waste/delete',
              effect: 'disabled',
            }" type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>

    <Dialog :visible="visible" :title="title" @submit="submit()" @show="show()">
      <template>
        <div v-if="title == '删除'">您确定要删除吗？</div>
        <div v-else>
          <el-form ref="form" :rules="rules" :model="form" label-width="117px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="设施名称:" prop="buildVo.buildId">
                  <el-select v-model="form.buildVo.buildId" placeholder="请选择设施" default-first-option>
                    <div class="option">
                      <el-option v-for="item in parentArr" :key="item.buildId" :label="item.buildName"
                        :value="item.buildId"></el-option>
                    </div>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="废物名称:" prop="wasteName">
                  <el-input v-model="form.wasteName" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="房间号:" prop="roomNumber">
                  <el-input v-model="form.roomNumber" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="废物类别:" prop="wasteCategory">
                  <el-input v-model="form.wasteCategory" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="废物来源:" prop="wasteFrom">
                  <el-input v-model="form.wasteFrom" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备位号:" prop="deviceTag">
                  <el-input v-model="form.deviceTag" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备功能:" prop="deviceFunction">
                  <el-input v-model="form.deviceFunction" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="外表面积(㎡):" prop="outsideArea">
                  <el-input v-model="form.outsideArea" oninput="value=value.replace(/[^0-9.]/g,'')" show-word-limit
                    maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="内表面积(㎡)" prop="innerArea">
                  <el-input v-model="form.innerArea" oninput="value=value.replace(/[^0-9.]/g,'')" show-word-limit
                    maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="长度(m):" prop="length">
                  <el-input v-model="form.length" oninput="value=value.replace(/[^0-9.]/g,'')" show-word-limit
                    maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="数量:" prop="nums">
                  <el-input v-model.number="form.nums" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材质" prop="materials">
                  <el-input v-model="form.materials" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="接触介质" prop="contactMedium">
                  <el-input v-model="form.contactMedium" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="介质来源" prop="mediumSource">
                  <el-input v-model="form.mediumSource" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="放置状态:" prop="placingState">
                  <el-input v-model="form.placingState" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属系统:" prop="belongSys">
                  <el-input v-model="form.belongSys" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="余量:" prop="margin">
                  <el-input v-model="form.margin" oninput="value=value.replace(/[^0-9.]/g,'')" show-word-limit
                    maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="余量单位:" prop="marginUnit">
                  <div>
                    <el-select v-model="form.marginUnit" placeholder="请选择余量单位">
                      <el-option label="m" value="m"></el-option>
                      <el-option label="m³" value="m³"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重量:" prop="weight">
                  <el-input v-model="form.weight" oninput="value=value.replace(/[^0-9.]/g,'')" show-word-limit
                    maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="重量单位:" prop="weightUnit">
                  <div>
                    <el-select v-model="form.weightUnit" placeholder="请选择重量单位">
                      <el-option label="t" value="t"></el-option>
                      <el-option label="Kg" value="Kg"></el-option>
                    </el-select>
                  </div>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="α射线计量(Bq/cm²):" prop="alphaRays">
                  <el-input v-model="form.alphaRays" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="β射线计量(Bq/cm²):" prop="betaRays">
                  <el-input v-model="form.betaRays" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="γ射线计量(μSv/h):" prop="gammaRays">
                  <el-input v-model="form.gammaRays" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="锶同位素辐射计量(Bq/kg):" prop="srRadiation">
                  <el-input v-model="form.srRadiation" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="铯放射性元素辐射计量(Bq/kg):" prop="csRadiation">
                  <el-input v-model="form.csRadiation" show-word-limit maxlength="10"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="废物备注:" prop="comment">
              <el-input type="textarea" v-model="form.comment" show-word-limit maxlength="50"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Dialog from "@/components/Dialog.vue";
import {
  dataWasteAdd as add,
  dataWasteUpdate as update,
  dataWasteDelete as deleteFn,
  dataWasteFindAll as requestFn,
  // 获取所有项目
  prjBuildGetList,
} from "../../utils/api";
export default {
  components: {
    Nav,
    Tab,
    Dialog,
  },
  data() {
    return {
      title: "",
      tableData: [],
      nav: [
        {
          name: "数据管理",
          path: "/data",
          isClick: false,
        },
        {
          name: "废物库",
          path: "/waste",
          isClick: false,
        },
      ],
      loading: true,
      headerList: {
        "buildVo.areaName": "片区名称",
        "buildVo.buildName": "设施名称",
        wasteName: "废物名称",
        roomNumber: "房间号",
        deviceTag: "设备位号",
        creatorName: "创建人",
        createTime: "创建时间",
      },
      request: {
        data: {
          areaName: "",
          buildName: "",
          wasteName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },
      parentArr: [],
      parentProReq: {
        data: {
          buildId: "",
          areaName: "",
          buildName: "",
        },
        page: 1,
        limit: 200,
      },

      form: {
        buildVo: {
          buildId: "",
        },
        wasteName: "",
        roomNumber: "",
        wasteCategory: "",
        wasteFrom: "",
        deviceTag: "",
        deviceFunction: "",
        outsideArea: "",
        innerArea: "",
        length: "",
        nums: "",
        materials: "",
        contactMedium: "",
        mediumSource: "",
        placingState: "",
        belongSys: "",
        margin: "",
        marginUnit: "",
        weight: "",
        weightUnit: "",
        alphaRays: "",
        betaRays: "",
        gammaRays: "",
        srRadiation: "",
        csRadiation: "",
        comment: "",
        alphaUnit: "Bq/cm²",
        betaUnit: "Bq/cm²",
        csRadiationUnit: "Bq/kg",
        gammaUnit: "μSv/h",
        innerAreaUnit: "㎡",
        lengthUnit: "m",
        outsideAreaUnit: "㎡",
        srRadiationUnit: "Bq/kg",
      },
      rules: {
        "buildVo.buildId": [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        wasteName: [
          { required: true, message: "废物名称不能为空", trigger: "blur" },
        ],
        nums: [
          {
            // required: true,
            trigger: "blur",
            validator: this.validate,
          },
        ],
        outsideArea: [
          {
            // required: true,
            trigger: "blur",
            validator: this.validate,
          },
        ],
        innerArea: [
          {
            // required: true,
            trigger: "blur",
            validator: this.validate,
          },
        ],
        length: [
          {
            // required: true,
            trigger: "blur",
            validator: this.validate,
          },
        ],
        margin: [
          {
            // required: true,
            trigger: "blur",
            validator: this.validate,
          },
        ],
        weight: [
          {
            // required: true,
            trigger: "blur",
            validator: this.validate,
          },
        ],
      },
      visible: false,
    };
  },
  created() {
    this.prjBuildGetList();
    this.requestFn();
  },
  methods: {
    validate(rule, val, callback) {
      let value = "" + val;
      if (!value) {
        callback();
      } else if (value.indexOf(".") != -1 && value.split(".").length > 2) {
        callback(new Error("请输入正确格式的数字")); //防止输入多个小数点
      } else if (value.length > 12) {
        callback(new Error("最多输入12位数"));
      } else if (value.indexOf(".") != -1 && value.split(".")[0].length > 9) {
        callback(new Error("小数点前最多输入9位数"));
      } else if (value.indexOf(".") != -1 && value.split(".")[1].length > 2) {
        callback(new Error("请输入正确的小数位数")); //小数点后两位
      } else {
        callback();
      }
    },

    // 获取废物库数据
    async requestFn() {
      let res = await requestFn(this.request);
      if (res) {
        this.tableData = res.data.data.list;
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
      }
      this.loading = false;
    },
    // 获取所有项目
    async prjBuildGetList() {
      const res = await prjBuildGetList(this.parentProReq);
      if (res) this.parentArr = res.data.data.list;
    },
    // + /
    addOrUpdateOrDelete(title, row) {
      this.title = title
      this.show();
      if (this.title == '删除') return this.deleteValue = row.wasteId;
      if (row) {
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
        });
      }
    },

    show() {
      if (this.visible) {
        if (this.title == "新增" || this.title == "编辑") this.$refs["form"].resetFields();
        this.requestFn()
      }
      this.visible = !this.visible;
    },

    //提交
    async submit() {



      if (this.title == '删除') {
        await deleteFn({
          wasteId: this.deleteValue,
        });
        this.show();
      } else {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            this.form["buildId"] =
              this.form.buildVo.buildId;
            if (this.title == "新增") {
              await add(this.form);
            } else {
              await update(this.form);
            }
            this.show();
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

    //切换条数
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

    toogleExpand(row) {
      let $table = this.$refs.tab.$refs.table;
      this.tableData.map((item) => {
        if (row.wasteId != item.wasteId) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
  },
};
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}

.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  padding-left: 1%;
  margin-bottom: 0;
  width: 27%;
}

.el-select {
  width: 100%;
}

.waste :deep(.el-table__expand-icon .el-icon-arrow-right) {
  display: none;
}
</style>  