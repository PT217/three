<template>
  <div class="model">
    <Nav :nav="nav"></Nav>
    <Tab ref="tab" title="模型库列表" :tableData="tableData" :headerList="headerList" :request="request"
      @pageChange="pageChange" @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form inline>
          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data.factoryName" placeholder="请输入片区名称">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data.buildName" placeholder="请输入设施名称">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data.modelName" placeholder="请输入模型名称">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button v-has="{
              action: '/data/model/add',
              effect: 'disabled',
            }" type="primary" size="mini" @click.prevent="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="expand">
        <el-table-column type="expand" width="1">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="房间号:">
                <span>{{ props.row.roomNumber }}</span>
              </el-form-item>
              <el-form-item label="模型长度:">
                <span v-if="props.row.length">{{ props.row.length }}cm</span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="模型宽度:">
                <span v-if="props.row.width">{{ props.row.width }}cm</span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="模型高度:">
                <span v-if="props.row.height">{{ props.row.height }}cm</span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="模型半径:">
                <span v-if="props.row.radius">{{ props.row.radius }}cm</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="模型外径:">
                <span v-if="props.row.outsideDiameter">{{ props.row.outsideDiameter }}cm</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="模型内径:">
                <span v-if="props.row.innerDiameter">{{ props.row.innerDiameter }}cm</span>
                <span v-else>无</span>
              </el-form-item>

              <el-form-item label="备注:">
                <span>{{ props.row.note }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
      </template>

      <template slot="column">
        <el-table-column label="操作" width="350px" align="left">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="preview(scope.row.path)">预览</el-button>
            <el-button type="primary" size="mini" @click="toogleExpand(scope.row)">查看详情</el-button>
            <el-button v-has="{
              action: '/data/model/update',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>

            <el-button v-has="{
              action: '/data/model/delete',
              effect: 'disabled',
            }" type="danger" size="mini" @click="addOrUpdateOrDelete('删除', scope.row)">删除</el-button>
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
              <el-select size="small" clearable filterable v-model="form.buildId">
                <el-option v-for="item in parentProjectList" :key="item.buildId" :value="item.buildId"
                  :label="item.buildName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12" prop="modelName">
            <el-form-item label="模型名称:" prop="modelName">
              <el-input size="small" v-model="form.modelName" show-word-limit maxlength="10">
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="房间号:" prop="roomNumber">
              <el-input size="small" v-model="form.roomNumber" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型长度(cm):" prop="length">
              <el-input size="small" v-model="form.length" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型宽度(cm):" prop="width">
              <el-input size="small" v-model="form.width" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型高度(cm):" prop="height">
              <el-input size="small" v-model="form.height" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型半径(cm):" prop="radius">
              <el-input size="small" v-model="form.radius" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型外径(cm):" prop="outsideDiameter">
              <el-input size="small" v-model="form.outsideDiameter" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="模型内径(cm):" prop="innerDiameter">
              <el-input size="small" v-model="form.innerDiameter" show-word-limit maxlength="10"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注:" prop="note">
              <el-input type="textarea" v-model="form.note" show-word-limit maxlength="50"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12" v-show="title == '编辑' ? false : true">
            <el-form-item label="文件上传:" prop="fileName">
              <LargeFileCutting v-model="form.fileName" ref="LargeFileCutting" @complete="complete"
                :inputFile="form.fileName" url="data/model/chunk" accept=".zip" />
            </el-form-item>
          </el-col>


        </el-row>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import LargeFileCutting from "../../components/LargeFileCutting.vue";
import { mixins } from "../../mixin";
import {
  dataModelAdd as add,
  dataModelUpdate as update,
  dataModelPage as requestFn,
  dataModelDelete as deleteFn,
  // 判断模型名是否重复
  dataModelGetAllFileName,
  // 查询所有设施
  prjProjectGetBuildList,
} from "../../utils/api";
export default {
  mixins: [mixins],
  components: {
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
          name: "模型库",
          path: "/model",
          isClick: false,
        },
      ],
      headerList: {
        factoryName: "片区名称",
        buildName: "设施名称",
        modelName: "模型名称",
        "creator.accountName": "创建人",
        createTime: "创建时间",
      },
      request: {
        data: {
          factoryName: "",
          buildName: "",
          modelName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },
      title: "",
      visible: false,
      // 查询所有设施list
      childProjectFindParentProjectListRequest: {
        data: "",
        page: 1,
        limit: 1000,
      },
      // 设施
      parentProjectList: [],
      form: {},
      deleteValue: "",

      rules: {
        buildId: [
          { required: true, message: "设施名称不能为空", trigger: "blur" },
        ],
        modelName: [
          { required: true, message: "模型名称不能为空", trigger: "blur" },
        ],
        factoryName: [
          { required: true, message: "片区名称不能为空", trigger: "blur" },
        ],
        buildName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
        length: [
          {
            trigger: "blur",
            validator: this.validator,
          },
        ],
        width: [
          {
            trigger: "blur",
            validator: this.validator,
          },
        ],
        radius: [
          {
            trigger: "blur",
            validator: this.validator,
          },
        ],
        outsideDiameter: [
          {
            trigger: "blur",
            validator: this.validator,
          },
        ],
        innerDiameter: [
          {
            trigger: "blur",
            validator: this.validator,
          },
        ],
        height: [
          {
            trigger: "blur",
            validator: this.validator,
          },
        ],
        fileName: [
          {
            required: true,
            trigger: "blur",


            validator: (rule, val, callback) => this.form.fileName ? callback() : callback(new Error("必传文件不能为空")),
          },
        ],
      },
    };
  },
  created() {
    this.prjProjectGetBuildList();
  },
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
          callback(new Error("最多输入12位数"));
        } else if (value.indexOf(".") != -1 && value.split(".")[0].length > 9) {
          callback(new Error("小数点前最多输入9位数"));
        } else {
          callback();
        }
      }
    },

    // 获取表格数据
    async requestFn(reset) {
      if (reset) this.request.page = 1;
      const res = await requestFn(this.request);
      if (res) this.handleData(res.data);
    },
    // 查询所有设施
    async prjProjectGetBuildList() {
      const res = await prjProjectGetBuildList(
        this.childProjectFindParentProjectListRequest
      );
      if (res) this.parentProjectList = res.data.data.list;
    },

    async add() {
      console.log(this.form);
      return await add(this.form);
    },
    async update() {
      return await update(this.form);
    },
    async deleteFn() {
      return await deleteFn({
        modelId: this.deleteValue,
      });
    },

    addOrUpdateOrDelete(title, row) {
      this.title = title;
      this.show();
      if (title == "删除") return this.deleteValue = row.modelId;
      if (row) {
        this.$nextTick(() => {
          this.form = _.cloneDeep(row);
          this.form["fileName"] = row.buildName;
        });
      }
      if (title == "删除") this.deleteValue = row.modelId;
    },
    // 弹框
    show() {
      if (this.visible) {

        console.log(999);
        if (this.title == "新增" || this.title == "编辑") {
          this.$refs["form"].resetFields();
          this.$refs.LargeFileCutting.clear();
        }
        this.requestFn()
      }
      this.visible = !this.visible;
    },
    // 查询详情
    toogleExpand(row) {
      let $table = this.$refs.tab.$refs.table;
      console.log(row);
      this.tableData.map((item) => {
        if (row.modelId != item.modelId) {
          $table.toggleRowExpansion(item, false);
        }
      });
      $table.toggleRowExpansion(row);
    },
    // 模型预览
    preview(path) {
      this.$router.push({ name: "threeModel", query: { path } });
      window.scroll(0, 0);
    },
    // 完整
    complete(data) {

      this.form.fileName = data.fileName;
      this.form.hash = data.hash;

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
  margin-left: 4%;
  margin-bottom: 0;
  width: 25%;
}

.model:deep(.el-table__expand-icon .el-icon-arrow-right) {
  display: none;
}
</style>