<!--
 * @Author: PengTao mj19983171995@icloud.com
 * @Date: 2022-09-07 09:29:33
 * @LastEditors: PengTao mj19983171995@icloud.com
 * @LastEditTime: 2022-10-27 13:52:00
 * @FilePath: /NDP/chengwei/src/views/data/path.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <Nav :nav="nav"></Nav>

    <Tab title="角色管理列表" :tableData="tableData" :headerList="headerList" :request="request" @pageChange="pageChange"
      @limitChange="limitChange">
      <template slot="select">
        <el-form :inline="true">
          <el-form-item>
            <el-input clearable size="mini" @input="inputFn" v-model="request.data" placeholder="请输入角色名称"></el-input>
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
              <el-form-item label="角色名称:" prop="roleName">
                <el-input v-model.trim="form.roleName" show-word-limit maxlength="10"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="角色描述:" prop="description">
                <el-input v-model.trim="form.description" show-word-limit maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="路径分配:" prop="permissions">
                <el-table ref="multipleTable" :data="permissionsList" tooltip-effect="dark" class="multipleTable"
                  @selection-change="handleSelectionChange" :row-key="(row) => row.permId">
                  <el-table-column type="selection" width="55">
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
import { mixins } from "../../mixin";
import {
  roleCreateRole as add,
  roleUpdateRole as update,
  roleFindPageRoles as requestFn,
  roleDeleteRole as deleteFn,
  permFindAllPerms,
  roleFindRolePermsByRoleId,
} from "../../utils/api";
export default {
  mixins: [mixins],
  created() {
    this.permFindAllPerms();
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
          name: "项目人员管理",
          path: "/projectPersonnel",
          isClick: false,
        },
        {
          name: "角色管理",
          path: "/roles",
          isClick: false,
        },
      ],

      headerList: {
        roleName: "角色名称",
        description: "描述",
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

      permissionsList: [],

      form: {
        roleName: "",
        description: "",
        permissions: [],
      },

      rules: {
        "roleName": [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
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
    // 获取路径
    async permFindAllPerms() {
      const res = await permFindAllPerms();
      if (res) this.permissionsList = res.data.data;
    },
    async add() {
      return await add(this.form);
    },
    async update() {
      return await update(this.form);
    },
    async deleteFn() {
      return await deleteFn({
        roleId: this.deleteValue,
      });
    },
    async addOrUpdateOrDelete(title, row) {
      console.log(row);
      this.show();
      this.title = title;

      if (title == "删除") return (this.deleteValue = row.roleId);

      if (title == "编辑") {
        const res = await roleFindRolePermsByRoleId({
          roleId: row.roleId,
        });


        console.log(res);
        if (res) {
          this.$nextTick(() => {
            this.form = _.cloneDeep(res.data.data);
            this.toggleSelection(this.form.permissions);
          });
        }
      }
      this.$nextTick(() => {
        this.toggleSelection();
      });
    },

    toggleSelection(permissions) {
      if (permissions) {
        this.$nextTick(() => {
          permissions.map((permissionsItem) => {
            this.permissionsList.map((permissionsListItem) => {
              if (permissionsItem.permId == permissionsListItem.permId) {
                this.$refs.multipleTable.toggleRowSelection(
                  permissionsListItem,
                  true
                );
              }
            });
          });
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.form.permissions = val;
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
</style>
