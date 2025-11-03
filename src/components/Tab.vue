<template>
  <div class="Tab">
    <div class="title" v-if="showTitle">
      <img src="../assets/common/lb.png" />
      {{ title }}
    </div>

    <div class="center" :class="{ 'top-left': (leftSearch), 'top': (!leftSearch) }">
      <slot name="select"></slot>
      <slot name="addBtn"></slot>
    </div>

    <slot></slot>

    <!-- 传入height参数 -->
    <div v-if="height">
      <el-table v-if="tabShow" :height="height" :data="tableData" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" border ref="table" :cell-style="cellStyle">
        <slot name="expand"></slot>

        <el-table-column v-for="(key, value) in headerList" :key="key" :label="key" :prop="value" :formatter="formatter"
          align="left">
          <template slot-scope="{ row }">
            <el-tooltip effect="dark" :content="handleRow(row, value)" placement="bottom">
              <div class="cell-overflow"> {{ handleRow(row, value) }}</div>
            </el-tooltip>
          </template>
        </el-table-column>

        <slot name="column"></slot>
      </el-table>
    </div>

    <!-- 无传入height -->
    <div v-else>
      <el-table v-if="tabShow" :data="tableData" v-loading="loading" element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading" border ref="table" :cell-style="cellStyle">
        <slot name="expand"></slot>

        <el-table-column v-for="(key, value) in  headerList " :key="key" :label="key" :prop="value" :formatter="formatter"
          align="left">

          <template slot-scope="{ row }">
            <el-tooltip effect="dark" :content="handleRow(row, value)" placement="bottom">
              <div class="cell-overflow"> {{ handleRow(row, value) }}</div>
            </el-tooltip>
          </template>

        </el-table-column>
        <slot name="column"></slot>
      </el-table>
    </div>


    <el-pagination v-if="pageShow" background @current-change="pageChange" @size-change="limitChange"
      :current-page="request.page" :page-size="request.limit" :total="request.total" layout="total,sizes,prev,pager,next"
      :page-sizes="[5, 10, 20, 50, 100]"></el-pagination>
  </div>
</template>

<script>

export default {
  props: {
    title: "",
    headerList: {},
    tableData: [],
    leftSearch: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    request: {
      type: Object,
      default: () => ({
        data: "",
        page: 1,
        limit: 5,
      }),
    },
    tabShow: {
      default: true,
    },
    pageShow: {
      default: true,
    },
    loading: true,
    height: {
      type: String / Number,
      default: null
    }
  },
  created() {
  },
  data() {
    return {
      color: {
        '未下发': "#999999",
        '未完成': "#FA803F",
        '已完成': "#0FBE5B",
        '已超期': "#EE4444",
      }
    };
  },
  methods: {
    formatter(row, column, cellValue) {
      if (column.property == "accountInfo.roles" && row.accountInfo.roles) {
        let arr = [];
        row.roles.forEach((item) => arr.push(item.roleName));
        return arr.join("、");
      }
      return cellValue;
    },

    cellStyle({ row, column, rowIndex, columnIndex }) {

      // if (column.property == "taskName") return row.taskStatus == '已超期' ? { color: "#EE4444" } : { color: "#4466EE" }
      if (column.property == "taskStatus") return {
        color: this.color[row.taskStatus]
      }
    },
    pageChange(page) {
      this.$emit("pageChange", page);
    },
    limitChange(limit) {
      this.$emit("limitChange", limit);
    },

    handleRow(row, value) {
      const keys = value.split('.');
      if (keys.length == 2) return row[keys[0]][keys[1]]
      return row[keys[0]]
    }
  },
};
</script>

<style lang='less' scoped>
.Tab {
  background-color: #fff;
  height: calc(100% - 90px);
  padding: 0 17px;
  box-shadow: 0px 3px 6px rgba(48, 116, 237, 0.1);
  overflow: auto;

  .title {
    height: 50px;
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid #ebebeb;
    padding: 0 20px;
    margin-bottom: 20px;
    color: #333;

    img {
      width: 22px;
      height: 22px;
      margin-right: 17px;
    }
  }

  .top {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;

  }

  .top-left {
    display: flex;
    justify-content: space-between;

  }

  .center {
    font-weight: 700;

    :deep(.el-button--mini) {
      border-radius: 0;
    }

  }

  .el-table {
    margin-top: 20px;

    :deep(th.el-table__cell.is-leaf) {
      border-right: 0;
      color: #333;
      font-size: 16px;
      font-weight: bold;
      background-color: #F6F6F6;
    }

    :deep(.cell) {
      padding-left: 0px !important;
    }

    :deep(.el-button) {
      border-radius: 0;
    }
  }

  .el-pagination {
    padding-right: 20px;
    height: 70px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .cell-overflow {
    white-space: nowrap;
    /* 防止文本换行 */
    overflow: hidden;
    /* 隐藏溢出内容 */
    text-overflow: ellipsis;
    /* 显示省略号 */
    max-width: 100px;
    /* 适当设置最大宽度 */
  }

}
</style>