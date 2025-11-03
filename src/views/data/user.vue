<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="用户管理列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange" :loading="loading">
      <template slot="select">
        <el-form :inline="true">
          <el-form-item>
            <el-input placeholder="请输入姓名" v-model="request.data.staffName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input placeholder="请输入用户名" v-model="request.data.accountName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-input placeholder="请输入部门名" v-model="request.data.departName" size="mini" clearable
              @input="inputFn"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="mini" @click="requestFn('reset')">搜索</el-button>
          </el-form-item>

          <el-form-item>
            <el-button v-has="{
              action: '/account/createAccount',
              effect: 'disabled',
            }" type="primary" size="mini" @click="addOrUpdateOrDelete('新增')">新增</el-button>
          </el-form-item>
        </el-form>
      </template>

      <template slot="column">
        <el-table-column label="状态" align="left">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.accountInfo.accountStatus" :active-value="1" :inactive-value="0"
              @change="addOrUpdateOrDelete('状态', scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px" align="left">
          <template slot-scope="scope">
            <el-button v-has="{ action: '/account/updateAccount' }" type="primary" size="mini"
              @click="addOrUpdateOrDelete('编辑', scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </Tab>

    <Dialog :title="title" :visible="visible" @show="show" @submit="submit">
      <template>
        <div v-if="title == '状态'">
          是否{{ switchVo.flag ? "开启" : "锁定" }}此用户？
        </div>

        <el-form v-else ref="form" :rules="rules" :model="form" label-width="117px">
          <el-row>
            <!-- 姓名 -->
            <el-col :span="12">
              <el-form-item label="姓名:" prop="staffName">
                <el-input v-model.trim="form.staffName" maxlength="10" show-word-limit></el-input>
              </el-form-item>
            </el-col>

            <!-- 性别 -->
            <el-col :span="12">
              <el-form-item label="性别:" prop="gender">
                <el-select v-model="form.gender">
                  <el-option value="1" label="男"> </el-option>
                  <el-option value="0" label="女"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <!-- 用户名 -->
            <el-col :span="12">
              <el-form-item label="用户名:" prop="accountInfoDto.accountName">
                <el-input v-model.trim="form.accountInfoDto.accountName"></el-input>
              </el-form-item>
            </el-col>

            <!-- 用户密码 -->
            <el-col :span="12">
              <el-form-item label="用户密码:" prop="accountInfoDto.password">
                <el-input v-model.trim="form.accountInfoDto.password" type="password" @input="
                  form.accountInfoDto.password =
                  form.accountInfoDto.password.replace(
                    /[\u4E00-\u9FA5]/g,
                    ''
                  )
                  "></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="职位:" prop="job">
                <el-input v-model.trim="form.job" maxlength="10" show-word-limit></el-input>
              </el-form-item>
            </el-col>

            <!-- 联系方式 -->
            <el-col :span="12">
              <el-form-item label="联系方式:" prop="phoneNum">
                <el-input v-model.trim="form.phoneNum" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="角色列表:" prop="accountInfoDto.roles">
                <el-select filterable v-model="form.accountInfoDto.roles[0]" @change="roleSelect">
                  <div class="option">
                    <el-option v-for="(item, index) in roleList" :key="item.roleId" :label="item.roleName"
                      :value="item.roleId"></el-option>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="部门名称:" prop="fkDepartId">
                <el-select v-model="form.fkDepartId">
                  <div class="option">
                    <el-option v-for="item in departmentList" :key="item.departId" :label="item.departName"
                      :value="item.departId"></el-option>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" :offset="12">
              <el-form-item class="path">
                <el-col :span="18">
                  <el-input placeholder="请输入路径名称" v-model="pathValue" size="mini" clearable @input="pathInput"></el-input>
                </el-col>
                <el-button type="primary" size="mini" @click="pathSearch">搜索</el-button>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="其他路径:" prop="accountInfoDto.permissions">
                <el-table ref="multipleTable" :data="permissionsList" tooltip-effect="dark" class="multipleTable"
                  @selection-change="handleSelectionChange" :row-key="(row) => row.permId">
                  <el-table-column type="selection" width="55" :selectable="() => false" reserve-selection>
                  </el-table-column>

                  <el-table-column label="路径名称" width="120">
                    <template slot-scope="scope">{{
                      scope.row.permName
                    }}</template>
                  </el-table-column>

                  <el-table-column prop="link" label="路径链接" width="120">
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Nav from "../../components/Nav.vue";
import Tab from "../../components/Tab.vue";
import Dialog from "../../components/Dialog.vue";
import {
  accountCreateAccount as add,
  accountUpdateAccount as update,
  accountFindAll as requestFn,
  // 修改状态
  accountUpdateAccountFlag,
  // 查询角色
  roleFindAllRoles,
  // 查询路径
  permFindAllPerms,
  // 查询部门
  departFindAll,
  //根据用户ID查询信息
  accountGetStaff,
  //根据角色ID查询信息
  roleFindRolePermsByRoleId,
} from "../../utils/api";
export default {
  components: {
    Nav,
    Tab,
    Dialog,
  },
  created() {
    this.requestFn("first");
  },
  data() {
    return {
      switchVo: {
        accountId: "",
        flag: "",
      },
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
          name: "用户管理",
          path: "/user",
          isClick: false,
        },
      ],
      tableData: [],
      // 部门列表
      roleList: [],
      permissionsList: [],
      permissionsListCp: [],
      departmentList: [],
      headerList: {
        staffName: "姓名",
        "accountInfo.accountName": "用户名",
        phoneNum: "联系方式",
        job: "职位",
        "departVo.departName": "部门名称",
        "accountInfo.creator": "创建用户",
        "accountInfo.createTime": "创建时间",
      },
      loading: true,
      // 表格数据请求
      request: {
        data: {
          staffName: "",
          accountName: "",
          departName: "",
        },
        page: 1,
        limit: 5,
        total: 5,
      },
      // 部门数据请求
      departmentReq: {
        data: "",
        page: 1,
        limit: 10,
      },
      visible: false,
      title: "",

      form: {
        staffName: "",
        job: "",
        gender: "",
        phoneNum: "",
        fkDepartId: "",
        accountInfoDto: {
          accountName: "",
          password: "",
          roles: [],
          // 其他路径
          permissions: [],
        },
      },
      // 当前角色对应路径列表
      rolePathList: [],
      multipleSelection: [],

      rules: {
        staffName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        phoneNum: [
          {
            trigger: "blur",
            validator: this.validate,
          },
        ],
        "accountInfoDto.accountName": [
          {
            required: true,
            trigger: "blur",
            validator: (rule, val, callback) => {
              let reg = /^[a-zA-Z0-9_]{3,10}$/;
              if (!val) {
                callback(new Error("用户名不能为空！"));
              } else if (!reg.test(val)) {
                callback(new Error("用户名为（3-10位字母/数字/下划线）"));
              } else {
                callback();
              }
            },
          },
        ],
        "accountInfoDto.password": [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              let val = value + "";
              if (!value) {
                callback(new Error("密码不能为空！"));
              } else if (val.length > 10 || val.length < 3) {
                callback(new Error("密码长度有误(长度应在3-10位之间)"));
              } else {
                callback();
              }
            },
          },
        ],
        "accountInfoDto.roles": [
          { required: true, message: "角色不能为空", trigger: "blur" },
        ],
      },
      pathValue: "",
    };
  },
  methods: {
    validate(rule, value, callback) {
      const validatePhoneNum =
        /^\+?1[3-9]\d{9}$/;

      if (value && !validatePhoneNum.test(value)) callback(new Error("请输入正确格式的手机号码"));
      else callback();
    },
    // 获取表格数据
    async requestFn(x) {
      if (x == "reset") this.request.page = 1;
      const res = await requestFn(this.request);

      console.log(res);
      console.log(x);
      if (res) {
        this.tableData = res.data.data.list;
        this.request.page = res.data.data.pageNum;
        this.request.limit = res.data.data.pageSize;
        this.request.total = res.data.data.total;
        if (x == "first") {
          this.roleFindAllRoles();
          this.permFindAllPerms();
          this.departFindAll();
        }
      }
      this.loading = false;
    },

    // 获取角色列表
    async roleFindAllRoles() {
      const res = await roleFindAllRoles();
      if (res) this.roleList = res.data.data;
    },
    // 获取路径列表
    async permFindAllPerms() {
      const res = await permFindAllPerms();
      if (res) {
        this.permissionsList = res.data.data;
        this.permissionsListCp = res.data.data;
      }
    },
    // 获取部门列表
    async departFindAll() {
      const res = await departFindAll(this.departmentReq);
      if (res) this.departmentList = res.data.data.list;
    },
    // 新增与编辑
    async addOrUpdateOrDelete(title, row) {
      console.log(row);
      this.show();
      this.title = title;
      this.rolePathList = [];

      if (title == "状态")
        this.switchVo = {
          accountId: row.accountInfo.accountId,
          flag: row.accountInfo.accountStatus,
        };
      if (title == "编辑") {
        const res1 = await accountGetStaff({
          accountId: row.accountInfo.accountId,
        });


        console.log(res1);
        if (res1) {
          this.$nextTick(async () => {
            let res2 = await roleFindRolePermsByRoleId({
              roleId: res1.data.data.accountInfoDto.roles[0],
            });
            if (res2) {
              this.form = _.cloneDeep(res1.data.data);
              console.log(typeof this.form.accountInfoDto.roles[0]);

              this.rolePathList = res2.data.data.permissions;
              this.handleSelectable();
              let map = new Map();
              this.toggleSelection(
                this.rolePathList
                  .concat(this.form.accountInfoDto.permissions)
                  .filter((i) => !map.has(i.permId) && map.set(i.permId))
              );
            }
          });
          return;
        }
      }
      this.$nextTick(() => {
        this.handleSelectable();
      });
    },
    show() {
      if (this.visible) {
        if (this.title == "新增" || this.title == "编辑") {
          this.$refs["form"].resetFields();
          this.toggleSelection();
        }
        this.requestFn()
      }
      this.visible = !this.visible;
    },
    async submit() {
      // 将角色对应路径分离
      this.form.accountInfoDto.permissions =
        this.form.accountInfoDto.permissions.filter(
          (item) =>
            !this.rolePathList.some(
              (rolePathListItem) => rolePathListItem.permId === item.permId
            )
        );

      switch (this.title) {
        case "状态":
          const res = await accountUpdateAccountFlag(this.switchVo);
          this.show();
          break;

        default:
          this.$refs["form"].validate(async (valid) => {
            if (valid) {
              if (this.title == "新增") await add(this.form);
              else await update(this.form);
              this.show();
            }
          });
      }
    },
    pageChange(page) {
      this.request.page = page;
      this.requestFn();
    },
    limitChange(limit) {
      this.request.limit = limit;
      this.requestFn();
    },
    inputFn(e) {
      if (!e) this.requestFn("reset");
    },

    handleSelectionChange(val) {
      this.form.accountInfoDto.permissions = val;
    },
    async roleSelect(val) {
      console.log(val);
      console.log(typeof val);
      const res = await roleFindRolePermsByRoleId({
        roleId: val,
      });
      if (res) {
        this.rolePathList = res.data.data.permissions;
        this.toggleSelection();
        this.handleSelectable();
        this.toggleSelection(this.rolePathList);
      }
    },
    // 弹框开始的禁用处理
    handleSelectable(row) {
      return !this.rolePathList.some(
        (item) => row && item.permId === row.permId
      );
    },
    // 打勾
    toggleSelection(permissions) {
      if (permissions) {
        this.$nextTick(() => {
          permissions.map((permissionsItem) => {
            this.permissionsList.map((permissionsListItem) => {
              if (permissionsItem.permId == permissionsListItem.permId) {
                this.$refs.multipleTable.toggleRowSelection(
                  permissionsListItem
                );
              }
            });
          });
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    pathInput(e) {
      if (!e) this.pathSearch();
    },
    pathSearch() {
      this.permissionsList = this.permissionsListCp;
      this.permissionsList = this.permissionsList.filter(
        (item) =>
          !this.pathValue ||
          item.permName.toLowerCase().includes(this.pathValue.toLowerCase())
      );
    },
  },
};
</script>

<style lang='less' scoped>
.multipleTable :deep(.el-table__body-wrapper) {
  width: 100% !important;
  height: 170px !important;
  overflow: auto !important;
}

.multipleTable :deep(.el-table__header-wrapper table),
.multipleTable :deep(.el-table__body-wrapper table) {
  width: 100% !important;
}

:deep(.el-table__header-wrapper .el-table-column--selection) {
  opacity: 0;
  cursor: text;
}

:deep(.path) {

  .el-button,
  .el-input__inner {
    border-radius: 0;
  }
}
</style>
