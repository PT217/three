<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="退役成本列表" :tabShow="false" :pageShow="false">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input v-model="request.data.costName" type="primary" size="mini" clearable
              @input="e => e ? '' : requestFn('reset')" placeholder="请输入单项成本名称"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click.prevent="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>
      <!-- content -->
      <div class="content">
        <div class="left">
          <span class="title">退役成本管理费用</span>
          <div v-for="(item, index) in costGroupList" :key="index" @click="leftCostGroupFn(item)"
            :class="[item.isClick ? 'colorFirst' : 'colorSecond']">
            {{ item.costGroupName }}
          </div>
        </div>

        <div class="right">
          <el-table :data="tableData" border>
            <template>
              <el-table-column v-for="(tableKey, tableValue, index) in headerList" :key="index" :label="tableKey"
                :prop="tableValue" align="left"></el-table-column>

              <el-table-column label="操作" align="left">
                <template slot-scope="scope">
                  <el-button type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
                  <el-button type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </template>
          </el-table>

          <div class="tablePagination">
            <el-pagination background @size-change="limitFn" @current-change="pageFn" :current-page="request.page"
              :page-sizes="[5, 10, 20, 30, 40, 50, 100, 150, 200]" :page-size="request.limit" :total="request.total"
              layout="total,sizes,prev,pager,next">
            </el-pagination>
          </div>
        </div>
      </div>
    </Tab>
    <!-- 新增 -->
    <Dialog :visible="visible" :title="title" @submit="submit" @show="show">
      <template>
        <div v-if="title == '删除'">您确定要删除吗？</div>
        <el-form v-else :rules="rules" ref="form" :model="form" label-width="117px">
          <el-form-item v-if="title == '新增'" label="费用类别:" prop="costGroup.costGroupId">
            <div class="selectList">
              <el-select v-model="form.costGroup.costGroupId" @change="changeFn">
                <el-option v-for="item  in costGroupList" :label="item.costGroupName" :value="item.costGroupId"
                  :key="item.costGroupId">
                </el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="单项成本名称:" prop="costName">
            <el-input v-model="form.costName"></el-input>
          </el-form-item>

          <el-form-item label="单项成本单位:" prop="costUnit">
            <el-input v-model="form.costUnit"></el-input>
          </el-form-item>

          <el-form-item label="单项成本价格:" prop="price">
            <el-input v-model="form.price" oninput="if (value < 0) value = 0;"></el-input>
          </el-form-item>

          <el-form-item v-if="request.data.costGroupId == 3 ||
            request.data.costGroupId == 5
            " label="规格/型号:" prop="specModels">
            <el-input v-model="form.specModels"></el-input>
          </el-form-item>


          <!-- 设备 -->
          <el-form-item v-if="request.data.costGroupId == 5" label="所属设备:" prop="paramCode">
            <div class="selectList">
              <el-select v-model="form.paramCode">
                <el-option v-for="item of paramCodeList" :label="item.note" :value="item.paramCode" :key="item.paramCode">
                </el-option>
              </el-select>
            </div>
          </el-form-item>

          <!-- 指标 -->
          <el-form-item v-if="request.data.costGroupId == 6
            " label="指标(%):" prop="paramCode">
            <div class="selectList">
              <el-select v-model="form.paramCode">
                <el-option v-for="optionItem in paramVoList" :value="optionItem.paramCode"
                  :label="optionItem.payCoefficient" :key="optionItem.payCoefficient">
                </el-option>
              </el-select>
            </div>
          </el-form-item>

          <el-form-item label="备注:" prop="comment">
            <el-input type="textarea" v-model="form.comment" show-word-limit maxlength="200"></el-input>
          </el-form-item>
        </el-form>
      </template>



    </Dialog>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Dialog from "@/components/Dialog.vue";
import {
  dataParamCost_groupList,

  dataReportFindDetailGroup,

  dataParamCostAdd as add,
  dataParamCostUpdate as update,
  dataParamCostPage as requestFn,
  dataParamCostDelete as deleteFn,
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
      request: {
        data: {
          costGroupId: 1,
          costName: "",
        },
        page: 1,
        limit: 5,
        total: 5
      },



      tableData: [],


      headerList: {
        costName: "单项成本名称",
        costUnit: "单项成本单位",
        price: "单项成本价格（元）",
        accountName: "创建人",
        createTime: "创建时间",
      },
      form: {
        costName: "",
        costUnit: "",
        price: "",
        specModels: "",
        comment: "",
        paramCode: "",
        costGroup: {
          costGroupId: ""
        },
      },
      rules: {
        "costGroup.costGroupId": [
          { required: true, message: "成本分类名称不能为空", trigger: "blur" },
        ],
        costName: [
          { required: true, message: "单项成本名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "单项成本名称长度应在20字及以下",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            trigger: "blur",
            validator: this.validate,
          },
        ],
        costUnit: [
          { required: true, message: "单项成本单位不能为空", trigger: "blur" },
          {
            required: true,
            message: "单项成本单位长度应在10字及以下",
            trigger: "blur",
            pattern: /^.{1,10}$/,
          },
        ],
      },

      costGroupList: [],
      loading: true,
      visible: false,
      // 指标列表
      paramVoList: [],
      // 设备列表
      paramCodeList: {},

    };
  },
  created() {
    this.dataParamCost_groupList();
    this.costFn()
  },
  methods: {
    validate(rule, value, callback) {
      let re =
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      let val = value + "";
      if (!val) {
        console.log("val :", val);
        console.log("this.val :", this.form.price);
        callback(new Error("数字不能为空"));
      } else if (!re.test(val)) {
        callback(new Error("请输入正确的数字格式"));
      } else if (val.indexOf(".") != -1 && val.split(".").length > 2) {
        callback(new Error("请输入正确格式的数字")); //防止输入多个小数点
      } else if (val.length > 12) {
        callback(new Error("最多输入12位数"));
      } else if (val.indexOf(".") != -1 && val.split(".")[0].length > 9) {
        callback(new Error("小数点前最多输入9位数"));
      } else if (val.indexOf(".") != -1 && val.split(".")[1].length > 2) {
        callback(new Error("请输入正确的小数位数")); //小数点后两位
      } else {
        callback();
      }
    },
    // 获取分类列表的数据
    async dataParamCost_groupList() {
      let res = await dataParamCost_groupList();
      if (res) {
        this.costGroupList = res.data.data.map(item => ({ ...item, isClick: false }))
        this.requestFn();
      }
    },
    // 获取数据
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      this.costGroupList.forEach((item) => {
        if (this.request.data.costGroupId == item.costGroupId) item.isClick = true
        else item.isClick = false
      });

      let res = await requestFn(this.request);
      if (res) {
        this.tableData = res.data.data.list;
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
      }
      this.loading = false;
    },
    //切换分类
    leftCostGroupFn(current) {
      this.costGroupList.forEach((item) => item.isClick = false);
      current.isClick = true;
      this.request.data.costGroupId = current.costGroupId;
      this.requestFn();
    },

    async costFn() {
      const res1 = await dataReportFindDetailGroup({ costGroupId: 5 });
      if (res1) this.paramCodeList = res1.data.data;

      console.log(this.paramCodeList);

      const res2 = await dataReportFindDetailGroup({ costGroupId: 6 });
      if (res2) this.paramVoList = res2.data.data;
      console.log(this.paramVoList);
    },

    show() {


      if (this.visible) {
        if (this.title == "新增" || this.title == "编辑") this.$refs["form"].resetFields();
        this.requestFn()
      }
      this.visible = !this.visible;
    },

    addOrUpdateOrDelete(title, row) {
      this.title = title;

      console.log(row);
      this.show();
      if (this.title == '删除') return this.deleteValue = row.costId;
      if (row) {
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
          console.log(this.form);
        });
      }
    },

    async submit() {
      if (this.title == '删除') {
        await deleteFn({
          costId: this.deleteValue,
        });
        this.show();
      } else {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            if (this.title == '新增') {
              this.form.costId = ""
              await add(this.form);
            } else {
              await update(this.form)
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


    changeFn(costGroupId) {
      this.request.data.costGroupId = costGroupId
      this.form = {
        costName: "",
        costUnit: "",
        price: "",
        specModels: "",
        comment: "",
        paramCode: "",
        costGroup: {
          costGroupId
        },
      }
    },


    //切换条数
    limitFn(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    //切换页数
    pageFn(page) {
      this.request.page = page;
      this.requestFn();
    },
  },

};
</script>

<style scoped>
.top {
  width: 360px;
  display: flex;
  justify-content: flex-end;
}

.content {
  display: flex;
  margin-top: 20px;
  border-top: 1px solid #ebebeb;
}

.left>.title {
  display: block;
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  line-height: 16px;
  color: #333333;
  border-bottom: 0;
  margin-top: 40px;
}

.left {
  height: 100%;
  width: 454px;
  min-width: 361;
  margin-left: 20px;
  border-right: 1px solid #ebebeb;
}

.left>div {
  padding-left: 30px;
  height: 36px;
  line-height: 36px;
  color: gray;
  opacity: 1;
  cursor: pointer;
  margin: 10px 0;
}

.left>div:hover {
  background-color: #f5f7fa;
}

.right {
  width: 100%;
  padding: 20px;
}

.top {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}

.top>.el-input {
  width: 200px;
  margin-right: 10px;
}

/* 分页 */
.tablePagination {
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* color */
.left .colorFirst {
  color: #333;
  background-color: #f5f7fa;
}

.left .colorSecond {
  color: gray;
}

/* 指标 */
.selectList :deep(.el-select) {
  width: 100%;
}
</style>
